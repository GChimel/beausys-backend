import { FastifyInstance } from "fastify";
import { AuhtenticateController } from "./controllers/authenticateController";
import { authMiddleware } from "./middlewares/authMiddleware";

export async function publicRoutes(fastify: FastifyInstance) {
  fastify.post("/auth/google", AuhtenticateController.googleSignIn);
  fastify.post("/auth/sign-up", AuhtenticateController.signUp);
  fastify.post("/auth/sign-in", AuhtenticateController.signIn);
  fastify.post("/auth/refresh-token", AuhtenticateController.refreshToken);
}

export async function privateRoutes(fastify: FastifyInstance) {
  fastify.addHook("onRequest", authMiddleware);

  fastify.get("/me", async (request, reply) => {
    return reply.code(200).send({ ok: true });
  });
}
