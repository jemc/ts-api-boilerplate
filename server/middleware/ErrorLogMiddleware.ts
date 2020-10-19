import { Request, Response, NextFunction } from "express"

export default function ErrorLogMiddleware(
  err: Error,
  req: Request,
  res: Response,
  // We need to include the next function or express will call it automatically.
  // We *don't* want it to be called, because it would show the stack trace
  // to the end user, which is a bad practice and security issue.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) {
  console.log("Uncaught error:", err)
  res.sendStatus(500)
}
