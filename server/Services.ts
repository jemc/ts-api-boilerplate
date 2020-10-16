import Things, { newThings } from "./services/Things"
import { Connection } from "typeorm"

export default interface Services {
  things: Things
}

export function defaultServices(database: Connection) {
  return {
    things: newThings(database),
  }
}
