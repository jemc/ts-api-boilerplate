/* tslint:disable no-namespace */
import "express"
import Services from "../Services"

declare global {
  namespace Express {
    interface Request {
      services: Services
    }
  }
}
