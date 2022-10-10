import withHandler from "@libs/server/widthHandler";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.body);
  return res.json({ ok: true });
}

export default withHandler("POST", handler);
