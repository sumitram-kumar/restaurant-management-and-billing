import { AxiosHeaders, AxiosRequestConfig, AxiosResponse } from "axios";
import { httpClient, setAccessTokenGetter } from "../httpClient";

// A custom adapter is axios's own supported extension point — this avoids
// pulling in a mocking library just to inspect what the interceptor did to
// the outgoing request.
function captureRequestConfig() {
  let captured: AxiosRequestConfig | undefined;
  httpClient.defaults.adapter = async (config: AxiosRequestConfig) => {
    captured = config;
    const response: AxiosResponse = {
      data: {},
      status: 200,
      statusText: "OK",
      headers: {},
      config: config as AxiosRequestConfig & { headers: AxiosHeaders },
    };
    return response;
  };
  return () => captured;
}

describe("httpClient auth interceptor", () => {
  it("attaches an Authorization header when a token is available", async () => {
    setAccessTokenGetter(async () => "test-token");
    const getCaptured = captureRequestConfig();

    await httpClient.get("/menu");

    expect(getCaptured()?.headers?.Authorization).toBe("Bearer test-token");
  });

  it("sends no Authorization header when there is no token", async () => {
    setAccessTokenGetter(async () => undefined);
    const getCaptured = captureRequestConfig();

    await httpClient.get("/menu");

    expect(getCaptured()?.headers?.Authorization).toBeUndefined();
  });
});
