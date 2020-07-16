import { NowRequest, NowResponse } from "@vercel/node";
import get from "./get";
import set from "./set";

export default async (req: NowRequest, res: NowResponse) => {
  if (req.body) {
    await set(req, res);
  } else {
    await get(req, res);
  }
};
