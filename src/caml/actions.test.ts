import { endpointURL } from "./actions"

describe("endpointURL", () => {
  it("should return a string", () => {
    let url = endpointURL("GetList", "http://domain/path/to/site");
    expect(url).toEqual("http://domain/path/to/site/_vti_bin/Lists.asmx");
  })
})
