import Thing, { ThingRepository } from "../models/Thing"
import { Connection } from "typeorm"

type Things = Readonly<ReturnType<typeof newThings>>
export default Things

export function newThings(connection: Connection) {
  const repo = connection.getCustomRepository(ThingRepository)

  const save = async (thing: Thing) => await repo.save(thing)

  const reload = async (thing: Thing) => await repo.findOne(thing.id || -1)

  const destroy = async (thing: Thing) => void (await repo.remove(thing))

  const getById = async (id: number) => await repo.findOne(id || -1)

  const getAll = async () => await repo.find({ order: { createdAt: "DESC" } })

  return { repo, save, reload, destroy, getById, getAll }
}
