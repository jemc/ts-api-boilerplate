import * as status from "http-status-codes"
import SpecHelper from "../SpecHelper.helper"

describe("StatusAPI", () => {
  const baseUrl = "/api/v1/status"

  const helper = new SpecHelper()
  beforeAll(() => helper.setup())
  afterAll(() => helper.teardown())
  const request = () => helper.request

  describe("status", () => {
    it("says the server is available", async () => {
      await request()
        .get(baseUrl)
        .expect(status.OK)
        .expect((res: Response) => {
          expect(res.body).toEqual({ available: true })
        })
    })
  })
})
