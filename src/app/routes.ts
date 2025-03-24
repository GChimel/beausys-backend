import { FastifyInstance } from "fastify";
import { AuhtenticateController } from "./controllers/authenticateController";
import { CompanyController } from "./controllers/companyController";
import { ProductController } from "./controllers/productController";
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
  fastify.put("/user/:id", UserController.update);
  fastify.get("/user/:id", UserController.findById);

  // Company routes
  fastify.post("/company", CompanyController.create);
  fastify.get("/company/:id", CompanyController.findById);
  fastify.get("/company", CompanyController.findAll);
  fastify.delete("/company/:id", CompanyController.delete);
  fastify.put("/company/:id", CompanyController.update);

  // Product routes
  fastify.post("/product", ProductController.create);
  fastify.get("/product/id", ProductController.findById);
  fastify.get("/product", ProductController.findById);
  fastify.delete("/product/:id", ProductController.delete);
  fastify.put("/product/:id", ProductController.delete);
}
