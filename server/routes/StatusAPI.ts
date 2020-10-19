import { Express, Request, Response } from "express"

export function mountStatusAPI(app: Express) {
  const baseUrl = "/api/v1/status"

  app.get(baseUrl, showStatus)
}

async function showStatus(req: Request, res: Response) {
  res.json({ available: true })
}
