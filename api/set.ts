import { promisify } from "util";
import { NowRequest, NowResponse } from "@vercel/node";
import redis from "redis";
import pako from "pako";
import bcrypt from "bcrypt";
import { encrypt } from "../lib/crypto";
import isBase64Check from "is-base64";

const checkB64 = (str: string) => {
  if (str.indexOf("/") > -1) {
    if (str.endsWith("=")) {
      return str + "=";
    }
  }
  if (str.length % 4 === 0) return str;
  if (isBase64Check(str + "==")) return str + "==";
  if (isBase64Check(str + "=")) return str + "=";
  if (isBase64Check(str)) return str;
  console.log(
    "Checking: ",
    isBase64Check(str + ""),
    str.slice(str.length - 5, str.length + 10)
  );
  return null;
};

const baseURL = process.env.BASE_URL || "https://yank.one";

const client = redis.createClient(process.env.REDIS_URL);

const sendCommandAsync = promisify(client.send_command).bind(client);
const setAsync = promisify(client.set).bind(client);
const getAsync = promisify(client.get).bind(client);
const expireAsync = async (key: string, days: number) => {
  const future = new Date();
  future.setDate(future.getDate() + days);
  const expiredAt = future.getTime();
  await sendCommandAsync("EXPIRE", [key, expiredAt]);
};
const deflate = (str: string) => pako.deflate(str, { to: "string" });

client.on("error", function (error) {
  console.error(error);
});

export default async (req: NowRequest, res: NowResponse) => {
  let count = 0;
  req.on("data", () => {
    console.log(`${count++} uploading at:`, req.url);
  });
  req.on("end", async () => {
    try {
      let body = req.body;
      let isBase64 = false;
      const cacheKey = req.query.key as string;
      const password = req.query.pw;

      try {
        let bodyKeys = Object.entries(body);
        // Unwrap text key in JSON object
        // console.log("rawbody: ", body);
        if (bodyKeys.length === 1) {
          const base64Str = checkB64(bodyKeys[0][0] + bodyKeys[0][1]);
          if (base64Str == null) {
            body = bodyKeys[0][0];
            // raw text upload
            console.log("not base64");
          } else {
            body = base64Str.replace(/\s/g, "+");
            isBase64 = true;
            console.log(
              "this is base64",
              base64Str.slice(base64Str.length - 5, base64Str.length)
            );
          }
          // console.log("plucked body: ", body);
        } else if (bodyKeys.length > 1) {
          throw new Error("not supported");
        }
      } catch (err) {
        // console.error(err);
        res
          .status(400)
          .send(
            `I'm not handle this type of format yet, please try to encode the body as base64 instead! \r\n# echo yourfile.raw | openssl base64 | curl -X POST -d @- https://yank.one/set/${cacheKey}`
          );
      }

      if (!cacheKey) {
        return res
          .status(400)
          .json({ error: 'Please provide at least "key" in query params.' });
      }
      if (await getAsync(cacheKey)) {
        res.send(
          `Key ${cacheKey} already provisioned, please wait for its creator to consumed.\r\n`
        );
      }
      if (body) {
        const secret = password ? await bcrypt.hash(password, 10) : null;
        const encodedBody = secret ? encrypt(body, password) : body;
        console.log(encodedBody.length);
        const saveObj: any = {
          t: Date.now(),
          c: deflate(encodedBody),
          s: secret,
          b: isBase64,
        };
        await setAsync(cacheKey, JSON.stringify(saveObj));
        await expireAsync(cacheKey, 1);
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
  });
};
