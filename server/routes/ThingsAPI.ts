import { Express, Request, Response } from "express"
import { validate } from "class-validator"
import * as status from "http-status-codes"
import Thing from "../models/Thing"

export function mountThingsAPI(app: Express) {
  const baseUrl = "/api/v1/things"

  app.get(baseUrl, index)
  app.post(baseUrl, create)
  app.get(`${baseUrl}/:id`, read)
  app.delete(`${baseUrl}/:id`, destroy)
}

async function index(req: Request, res: Response) {
  const things = await req.services.things.getAll()

  res.json(Thing.show(things))
}

async function create(req: Request, res: Response) {
  let thing = new Thing({
    color: req.body.color?.toString(),
  })

  const errors = await validate(thing)
  if (errors.length > 0) {
    res.status(status.UNPROCESSABLE_ENTITY).json({ errors: errors })
    return
  }

  thing = await req.services.things.save(thing)
  res.status(status.CREATED).json(thing.show())
}

async function read(req: Request, res: Response) {
  const id = parseInt(req.params.id)
  const thing = await req.services.things.getById(id)
  if (!thing) {
    res.sendStatus(status.NOT_FOUND)
    return
  }

  res.json(thing.show())
}

async function destroy(req: Request, res: Response) {
  const id = parseInt(req.params.id)
  const thing = await req.services.things.getById(id)
  if (!thing) {
    res.sendStatus(status.NOT_FOUND)
    return
  }

  await req.services.things.destroy(thing)
  res.sendStatus(status.OK)
}
