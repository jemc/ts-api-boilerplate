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

// API & Models
import { mountThingsAPI } from "./routes/ThingsAPI"
import Thing from "./models/Thing"
const ALL_MODELS = [Thing]

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
  const options: typeorm.ConnectionOptions = {
    type: "postgres",
    url: DATABASE_URL,
    entities: ALL_MODELS,
    logging: !NODE_ENV_TEST,
  }
  const database = await typeorm.createConnection(options)

  // In a test environment, we create a fresh database for every test.
  // This ensures that running different jest suites in parallel won't
  // cause data conflicts and related race conditions in the tests.
  // The test cases within a single jest suite (file) are not run in parallel,
  // and each jest suite creates its own unique app and database connection.
  if (NODE_ENV_TEST) {
    const suffix = `test-${Math.floor(Math.random() * 0xffffffff)}`
    const name = `${new URL(DATABASE_URL).pathname.slice(1)}-${suffix}`

    // We use the existing database connection to bootstrap, creating the new
    // database with that connection, then make a new database connection to it.
    await database.query(`CREATE DATABASE "${name}" WITH OWNER = api`)
    process.on("exit", () => database.query(`DROP DATABASE "${name}"`))
    const databaseTest = await typeorm.createConnection({
      ...options,
      name: name,
      url: `${DATABASE_URL}-${suffix}`,
      synchronize: true,
    })

    // Close the old database connection that was used to bootstrap.
    database.close()
    return databaseTest
  }

  return database
}
