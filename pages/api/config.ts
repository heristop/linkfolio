import type { NextApiRequest, NextApiResponse } from "next";
import userConfig from "../../app/user.config";

type ResponseData = {
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  res.status(200).json(userConfig);
}
