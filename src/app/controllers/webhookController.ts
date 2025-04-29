import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prismaClient } from "../lib/prismaClient";

export class WebhookController {
  static async handlePayment(request: FastifyRequest, reply: FastifyReply) {
    const schema = z.object({
      event: z.string(),
      data: z.object({
        billingId: z.string(),
        status: z.string(),
        customerId: z.string(),
      }),
    });

    try {
      const { event, data } = schema.parse(request.body);

      if (event === "billing.paid") {
        // Find user by AbacatePay customer ID
        const user = await prismaClient.user.findFirst({
          where: { abacateId: data.customerId },
        });

        if (!user) {
          return reply.code(404).send({ message: "User not found" });
        }

        // Update subscription status
        await prismaClient.subscription.updateMany({
          where: { userId: user.id },
          data: {
            status: "ACTIVE",
            updatedAt: new Date(),
          },
        });

        return reply
          .code(200)
          .send({ message: "Payment processed successfully" });
      }

      if (event === "billing.failed") {
        // Find user by AbacatePay customer ID
        const user = await prismaClient.user.findFirst({
          where: { abacateId: data.customerId },
        });

        if (!user) {
          return reply.code(404).send({ message: "User not found" });
        }

        // Update subscription status
        await prismaClient.subscription.updateMany({
          where: { userId: user.id },
          data: {
            status: "FAILED",
            updatedAt: new Date(),
          },
        });

        return reply.code(200).send({ message: "Payment failure processed" });
      }

      return reply.code(200).send({ message: "Event processed" });
    } catch (error) {
      console.error("Webhook error:", error);
      return reply.code(400).send({ message: "Invalid webhook data" });
    }
  }
}
