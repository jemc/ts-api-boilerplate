import { Request, Response } from "express"

export default function ErrorLogMiddleware(
  err: Error,
  req: Request,
  res: Response,
) {
  console.log(err)
  res.sendStatus(500)
}
