import setupApp from "./setupApp"

const PORT = parseInt(process.env.PORT || "8000")

;(async () => {
  const { app, database } = await setupApp()
  const server = app.listen(PORT, () =>
    console.info("Listening on address", server.address()),
  )

  const exit = (exitCode: number) => {
    server.close((err) => {
      if (err) {
        console.error("Error during shutdown", err)
        process.exit(1)
      } else {
        console.info("Shutdown complete")
        process.exit(exitCode)
      }
    })
  }

  process.on("uncaughtException", (err: Error) => {
    console.error("Uncaught exception", err)
    exit(1)
  })

  process.on("unhandledRejection", (reason: {} | null | undefined) => {
    console.error("Unhandled Rejection at promise", reason)
    exit(2)
  })

  process.on("SIGINT", () => {
    console.info("Caught SIGINT")
    exit(128 + 2)
  })

  process.on("SIGTERM", () => {
    console.info("Caught SIGTERM")
    exit(128 + 2)
  })

  process.on("exit", () => {
    console.info("Exiting")
  })
})()
