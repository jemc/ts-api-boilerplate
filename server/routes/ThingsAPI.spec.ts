import * as status from "http-status-codes"
import Thing from "../models/Thing"
import SpecHelper from "../SpecHelper.helper"

describe("ThingsAPI", () => {
  const baseUrl = `/api/v1/things`

  const helper = new SpecHelper()
  beforeAll(() => helper.setup())
  afterAll(() => helper.teardown())
  const things = () => helper.services.things
  const request = () => helper.request

  // Clean up relevant database tables after each test.
  afterEach(async () => await things().repo.clear())

  describe("index", () => {
    it("shows all the things", async () => {
      const thing1 = await things().save(new Thing({ color: "red" }))
      const thing2 = await things().save(new Thing({ color: "blue" }))

      await request()
        .get(baseUrl)
        .expect(status.OK)
        .expect((res: Response) => {
          expect(res.body).toEqual(Thing.show([thing2, thing1]))
        })
    })
  })

  describe("create", () => {
    it("creates a thing", async () => {
      await request()
        .post(baseUrl)
        .send({ color: "green" })
        .expect(status.CREATED)
        .expect(async (res: Response) => {
          expect((res.body as any).color).toEqual("green")
        })
    })

    it("complains if required params were missing", async () => {
      await request()
        .post(baseUrl)
        .send({})
        .expect(status.UNPROCESSABLE_ENTITY)
        .expect((res: Response) => {
          expect(JSON.stringify(res.body)).toMatch("color should not be empty")
        })
    })
  })

  describe("read", () => {
    it("shows a thing", async () => {
      const thing = await things().save(new Thing({ color: "green" }))

      await request()
        .get(`${baseUrl}/${thing.id}`)
        .expect(status.OK)
        .expect((res: Response) => {
          expect(res.body).toEqual(thing.show())
        })
    })

    it("complains if the thing doesn't exist", async () => {
      await request().get(`${baseUrl}/bogus`).expect(status.NOT_FOUND)
    })
  })

  describe("destroy", () => {
    it("destroys a thing", async () => {
      const thing = await things().save(new Thing({ color: "green" }))

      await request().delete(`${baseUrl}/${thing.id}`).expect(status.OK)

      expect(await things().reload(thing)).toBe(undefined)
    })

    it("complains if the thing doesn't exist", async () => {
      await request().delete(`${baseUrl}/bogus`).expect(status.NOT_FOUND)
    })
  })
})
