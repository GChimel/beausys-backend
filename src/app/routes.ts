import { FastifyInstance } from "fastify";
import { AuhtenticateController } from "./controllers/authenticateController";
import { AvailableScheduleController } from "./controllers/availableScheduleController";
import { ClientController } from "./controllers/clientController";
import { CompanyController } from "./controllers/companyController";
import { ProductController } from "./controllers/productController";
import { ReportController } from "./controllers/reportController";
import { SaleController } from "./controllers/saleController";
import { ScheduleController } from "./controllers/scheduleController";
import { ServiceController } from "./controllers/serviceController";
import { SubscriptionController } from "./controllers/subscriptionController";
import { UserController } from "./controllers/userController";
import { WebhookController } from "./controllers/webhookController";
import { authMiddleware } from "./middlewares/authMiddleware";

export async function publicRoutes(fastify: FastifyInstance) {
  fastify.post("/auth/google", AuhtenticateController.googleSignIn);
  fastify.post("/auth/sign-up", AuhtenticateController.signUp);
  fastify.post("/auth/sign-in", AuhtenticateController.signIn);
  fastify.post("/auth/refresh-token", AuhtenticateController.refreshToken);

  // Webhook route (no authentication required)
  fastify.post("/webhook/payment", WebhookController.handlePayment);
}

export async function privateRoutes(fastify: FastifyInstance) {
  fastify.addHook("onRequest", authMiddleware);

  // User routes
  fastify.put("/user/:id", UserController.update);
  fastify.get("/user/:id", UserController.findById);

  // Subscription routes
  fastify.post("/subscription/trial", SubscriptionController.createTrial);
  fastify.get("/subscription/status", SubscriptionController.getStatus);
  fastify.post("/subscription/billing", SubscriptionController.createBilling);

  // Company routes
  fastify.post("/company", CompanyController.create);
  fastify.get("/company/:id", CompanyController.findById);
  fastify.get("/company", CompanyController.findAll);
  fastify.delete("/company/:id", CompanyController.delete);
  fastify.put("/company/:id", CompanyController.update);

  // Product routes
  fastify.post("/product", ProductController.create);
  fastify.get("/product/:id", ProductController.findById);
  fastify.get("/product", ProductController.findAll);
  fastify.delete("/product/:id", ProductController.delete);
  fastify.put("/product/:id", ProductController.update);

  // Service routes
  fastify.post("/service", ServiceController.create);
  fastify.get("/service/:id", ServiceController.findById);
  fastify.get("/service", ServiceController.findAll);
  fastify.delete("/service/:id", ServiceController.delete);
  fastify.put("/service/:id", ServiceController.update);

  // Schedule routes
  fastify.post("/schedule", ScheduleController.create);
  fastify.get("/schedule/:id", ScheduleController.findById);
  fastify.get("/schedule", ScheduleController.findAll);
  fastify.delete("/schedule/:id", ScheduleController.delete);
  fastify.post(
    "/schedule/available",
    AvailableScheduleController.createAvailableSchedule
  );
  fastify.get("/schedule/available", AvailableScheduleController.findAll);

  // Client routes
  fastify.post("/client", ClientController.register);
  fastify.get("/client", ClientController.findAll);
  fastify.get("/client/:clientName", ClientController.findByName);

  // Sale routes
  fastify.post("/sale", SaleController.create);

  // Report routes
  fastify.get("/report/schedule-summary", ReportController.scheduleSummary);
}
