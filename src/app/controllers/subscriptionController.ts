import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { getUserId } from "../helper/getUserId";
import { prismaClient } from "../lib/prismaClient";
import { AbacatePayService } from "../services/abacatePayService";

export class SubscriptionController {
  static async createTrial(request: FastifyRequest, reply: FastifyReply) {
    const userId = getUserId(request);

    try {
      const user = await prismaClient.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return reply.code(404).send({ message: "User not found" });
      }

      // Check if user already has a subscription
      const existingSubscription = await prismaClient.subscription.findFirst({
        where: { userId },
      });

      if (existingSubscription) {
        return reply
          .code(400)
          .send({ message: "User already has a subscription" });
      }

      // Calculate trial end date (15 days from now)
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 15);

      // Create trial subscription
      const subscription = await prismaClient.subscription.create({
        data: {
          userId,
          status: "TRIAL",
          amount: 0,
          nextBilling: trialEndDate,
        },
      });

      return reply.code(201).send(subscription);
    } catch (error) {
      console.error("Error creating trial:", error);
      return reply
        .code(500)
        .send({ message: "Error creating trial subscription" });
    }
  }

  static async getStatus(request: FastifyRequest, reply: FastifyReply) {
    const userId = getUserId(request);

    try {
      const subscription = await prismaClient.subscription.findFirst({
        where: { userId },
      });

      if (!subscription) {
        return reply.code(404).send({ message: "No subscription found" });
      }

      return reply.code(200).send(subscription);
    } catch (error) {
      console.error("Error getting subscription status:", error);
      return reply
        .code(500)
        .send({ message: "Error getting subscription status" });
    }
  }

  static async createBilling(request: FastifyRequest, reply: FastifyReply) {
    const userId = getUserId(request);
    const schema = z.object({
      amount: z.number(),
      returnUrl: z.string().url(),
      completionUrl: z.string().url(),
    });

    try {
      const { amount, returnUrl, completionUrl } = schema.parse(request.body);

      const user = await prismaClient.user.findUnique({
        where: { id: userId },
      });

      if (!user || !user.abacateId) {
        return reply.code(404).send({
          message: "User not found or not registered with AbacatePay",
        });
      }

      // Create billing in AbacatePay
      const billing = await AbacatePayService.createBilling({
        frequency: "ONE_TIME",
        methods: ["PIX"],
        products: [
          {
            externalId: `sub_${userId}`,
            name: "Monthly Subscription",
            description: "Monthly subscription payment",
            quantity: 1,
            price: amount * 100, // Convert to cents
          },
        ],
        returnUrl,
        completionUrl,
        customerId: user.abacateId,
      });

      // Create subscription record
      const nextBilling = new Date();
      nextBilling.setMonth(nextBilling.getMonth() + 1);

      const subscription = await prismaClient.subscription.create({
        data: {
          userId,
          status: "PENDING",
          amount,
          nextBilling,
        },
      });

      return reply.code(201).send({
        subscription,
        billing,
      });
    } catch (error) {
      console.error("Error creating billing:", error);
      throw error;
      // return reply.code(500).send({ message: "Error creating billing" });
    }
  }
}
