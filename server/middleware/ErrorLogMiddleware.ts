import { Request, Response, NextFunction } from "express"

export default function ErrorLogMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log(err)
  res.sendStatus(500)
}
