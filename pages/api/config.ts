import type { NextApiRequest, NextApiResponse } from "next";
import { UserConfigType } from "@/types";
import userConfig from "~/user.config";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserConfigType>,
) {
  res.status(200).json(userConfig);
}
