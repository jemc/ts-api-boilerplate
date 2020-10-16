import { Request, Response, NextFunction, RequestHandler } from "express"

import Services from "../Services"

export default function ServicesMiddleware(services: Services): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    ;(req as any).services = services
    next()
  }
}
