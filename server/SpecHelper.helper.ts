import { Express } from "express"
import { Connection } from "typeorm"
import * as supertest from "supertest"

import setupApp from "./setupApp"
import Services, { defaultServices } from "./Services"

export default class SpecHelper {
  public app!: Express
  public database!: Connection
  public request!: supertest.SuperTest<supertest.Test>
  public services!: Services

  public setup() {
    return (async (helper) => {
      Object.assign(helper, await setupApp())
      helper.request = supertest(helper.app)
      helper.services = defaultServices(helper.database)
    })(this)
  }

  public teardown() {
    return (async (helper) => {
      await helper.database.close()
    })(this)
  }
}
