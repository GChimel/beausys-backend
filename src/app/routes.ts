import { FastifyInstance } from "fastify";
import { AuhtenticateController } from "./controllers/authenticateController";
import { UserController } from "./controllers/userController";
import { authMiddleware } from "./middlewares/authMiddleware";

export async function publicRoutes(fastify: FastifyInstance) {
  fastify.post("/auth/google", AuhtenticateController.googleSignIn);
  fastify.post("/auth/sign-up", AuhtenticateController.signUp);
  fastify.post("/auth/sign-in", AuhtenticateController.signIn);
  fastify.post("/auth/refresh-token", AuhtenticateController.refreshToken);
}

export async function privateRoutes(fastify: FastifyInstance) {
  fastify.addHook("onRequest", authMiddleware);

  // User routes
  fastify.patch("/user/:id", UserController.update);
  fastify.get("/user/:id", UserController.findById);
}
