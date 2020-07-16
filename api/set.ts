import { promisify } from "util";
import { NowRequest, NowResponse } from "@vercel/node";
import redis from "redis";
import pako from "pako";
import bcrypt from "bcrypt";
import { encrypt } from "../lib/crypto";

const baseURL = process.env.BASE_URL || "https://yank.run";

const client = redis.createClient(process.env.REDIS_URL);

const sendCommandAsync = promisify(client.send_command).bind(client);
const setAsync = promisify(client.set).bind(client);
const getAsync = promisify(client.get).bind(client);
const expireAsync = (key: string, days: number) => {
  const future = new Date();
  future.setDate(future.getDate() + days);
  const expiredAt = future.getTime();
  sendCommandAsync("EXPIRE", [key, expiredAt]);
};
const deflate = (str: string) => pako.deflate(str, { to: "string" });

client.on("error", function (error) {
  console.error(error);
});

export default async (req: NowRequest, res: NowResponse) => {
  try {
    let body = req.body;
    let bodyKeys = Object.keys(body);

    // Unwrap text key in JSON object
    // console.log("rawbody: ", body);
    if (bodyKeys.length === 1) {
      body = bodyKeys[0];
      // console.log("plucked body: ", body);
    }

    const cacheKey = req.query.key;
    const password = req.query.pw;
    if (!cacheKey) {
      return res
        .status(400)
        .json({ error: 'Please provide at least "key" in query params.' });
    }
    if (await getAsync(cacheKey)) {
      res.send(
        `Key ${cacheKey} already provisioned, please wait for its creator to consumed.`
      );
    }
    if (body) {
      const secret = password ? await bcrypt.hash(password, 10) : null;
      const encodedBody = secret ? encrypt(body, password) : body;
      const saveObj: any = {
        t: Date.now(),
        c: deflate(encodedBody),
        s: secret,
      };
      await setAsync(cacheKey, JSON.stringify(saveObj));
      console.log(
        `[set] ${cacheKey} - pw: ${password} - ${saveObj.c.length} chars`
      );
      res.send(`${baseURL}/${cacheKey}${password ? "/" + password : ""}`);
      client.unref();
    }
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ error: "Could not yank new content, please try again later" });
  }
};
