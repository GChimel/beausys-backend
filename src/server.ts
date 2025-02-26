import FastifyCORS from "@fastify/cors";
import FastifyJWT from "@fastify/jwt";
import Fastify from "fastify";
import { ZodError } from "zod";
import { ENV_VARS } from "./app/config/env";

const app = Fastify();

const jwtSecret = ENV_VARS.JWT_SECRET;
const jwtExpiresIn = ENV_VARS.JWT_EXPIRES_IN;

if (!jwtSecret || !jwtExpiresIn) {
  throw new Error("JWT_SECRET or JWT_EXPIRES_IN is not defined");
}

app.register(FastifyCORS);

app.register(FastifyJWT, {
  secret: jwtSecret,
  sign: {
    expiresIn: jwtExpiresIn,
  },
});

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Validation error.",
      issues: error.format(),
    });
  }

  if (ENV_VARS.NODE_ENV !== "production") {
    console.error(error);
  } else {
    // todo: Deveria ter log para uma ferramenta externa como Datadog/NewRelic/Sentry etc
  }

  return reply.status(500).send({
    error: true,
    message: "Internal server error.",
  });
});

app
  .listen({
    port: 3000,
  })
  .then(() => {
    console.log("HTTP server running on http://localhost:3000");
  });
