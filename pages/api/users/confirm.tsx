import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/widthHandler";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { token } = req.body;
  res.status(200).end();
}

export default withHandler("POST", handler);
