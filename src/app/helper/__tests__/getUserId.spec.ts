import fastifyJwt from "@fastify/jwt";
import fastify from "fastify";
import { getUserId } from "../getUserId";

describe("Get User Id", () => {
  it("should return the user id from the jwt token on request", () => {
    const app = fastify();

    app.register(fastifyJwt, {
      secret: "secret",
    });

    app.decorate("jwt", {
      sign: jest.fn(),
      verify: jest.fn().mockReturnValue({ userId: "123" }),
      decode: jest.fn(),
      lookupToken: jest.fn(),
      options: {
        decode: {},
        sign: {},
        verify: {},
      },
    });

    app.decorate("request", {
      headers: {
        authorization: "Bearer token",
      },
    });

    const mockRequest = {
      user: { sub: "123" },
    } as any;

    const userId = getUserId(mockRequest);
    expect(userId).toBe("123");
  });
});
