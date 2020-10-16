import { Express } from "express"
import * as express from "express"
require("express-async-errors")

// Database
import * as typeorm from "typeorm"

// Middleware
import * as bodyParser from "body-parser"
import * as compression from "compression"
import * as cookieParser from "cookie-parser"
import * as morgan from "morgan"
import ErrorLogMiddleware from "./middleware/ErrorLogMiddleware"
import ServicesMiddleware from "./middleware/ServicesMiddleware"
import { defaultServices } from "./Services"

// API
import { mountThingsAPI } from "./routes/ThingsAPI"
import Thing from "./models/Thing"

const NODE_ENV_TEST = process.env.NODE_ENV === "test"

export default async function setupApp() {
  const app = express()
  const database = await setupDatabaseConnection()
  setupStandardMiddleware(app)
  setupServicesMiddleware(app, database)
  setupMountedAPIs(app)
  setupErrorLogMiddleware(app)
  return { app, database }
}

function setupStandardMiddleware(app: Express) {
  app.use(bodyParser.json())
  app.use(cookieParser())
  app.use(compression())
  if (!NODE_ENV_TEST) app.use(morgan("combined"))
}

function setupServicesMiddleware(app: Express, database: typeorm.Connection) {
  app.use(ServicesMiddleware(defaultServices(database)))
}

function setupErrorLogMiddleware(app: Express) {
  app.use(ErrorLogMiddleware)
}

function setupMountedAPIs(app: Express) {
  mountThingsAPI(app)
}

export async function setupDatabaseConnection() {
  const DATABASE_URL = process.env.DATABASE_URL || "postgresql://localhost"
  return await typeorm.createConnection({
    type: "postgres",
    url: DATABASE_URL,
    entities: [Thing],
    synchronize: NODE_ENV_TEST,
    logging: !NODE_ENV_TEST,
  })
}
