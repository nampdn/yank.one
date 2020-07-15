import { NowRequest, NowResponse } from "@vercel/node";
import redis from "redis";
import { promisify } from "util";
import pako from "pako";
import bcrypt from "bcrypt";
import Cryptr from "cryptr";

const client = redis.createClient(process.env.REDIS_URL);

const getAsync = promisify(client.get).bind(client);
const sendCommandAsync = promisify(client.send_command).bind(client);
const delAsync = (key: string) => sendCommandAsync("DEL", [key]);

const inflate = (str: string) => pako.inflate(str, { to: "string" });

export function decrypt(cipherText: string, password: any) {
  const cryptr = new Cryptr(password);
  return cryptr.decrypt(cipherText);
}

client.on("error", function (error) {
  console.error(error);
});

export default async (req: NowRequest, res: NowResponse) => {
  const cacheKey = req.query.key;
  const password = req.query.pw;
  if (!cacheKey) {
    return res
      .status(400)
      .json({ error: 'Please provide at least "key" in query params.' });
  }
  try {
    const value = await getAsync(cacheKey);
    if (!value) {
      res.send(`${cacheKey} unavailable!`);
    } else {
      const loadObj = JSON.parse(value);
      let result = "";
      if (loadObj.s && loadObj.s.length > 0) {
        if (!password) {
          res.send(
            `Yanked content at ${cacheKey} has password protected! Append "pw" to your query params!`
          );
        } else {
          const match = await bcrypt.compare(password, loadObj.s);
          if (match) {
            result = inflate(loadObj.c);
            result = decrypt(result, password);
            await delAsync(cacheKey as string);
            res.send(result);
          } else {
            res.send("Wrong password!");
          }
        }
      } else {
        result = inflate(loadObj.c);
        await delAsync(cacheKey as string);
        res.send(result);
      }
    }
    client.unref();
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: "Server error" });
  }
};
