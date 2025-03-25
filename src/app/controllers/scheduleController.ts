import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prismaClient } from "../lib/prismaClient";

export class ScheduleController {
  static async create(request: FastifyRequest, reply: FastifyReply) {
    const schema = z.object({
      companyId: z.string().uuid(),
      date: z.string().transform((date) => new Date(date)),
      products: z.array(
        z.object({
          productId: z.string().uuid(),
          quantity: z.number(),
          discount: z.number().optional(),
        })
      ),
      services: z.array(
        z.object({
          serviceId: z.string().uuid(),
        })
      ),
      costumerName: z.string(),
      costumerEmail: z.string().email(),
      costumerPhone: z.string(),
    });

    const body = schema.parse(request.body);

    try {
      // Verify if company exists
      const company = await prismaClient.company.findUnique({
        where: { id: body.companyId },
      });

      if (!company) {
        return reply.code(404).send({ message: "Company not found" });
      }

      for (const product of body.products) {
        // Verify if product exists
        const productExists = await prismaClient.product.findUnique({
          where: { id: product.productId },
        });

        if (!productExists) {
          return reply.code(404).send({ message: "Product not found" });
        }
      }

      for (const service of body.services) {
        // Verify if service exists
        const serviceExists = await prismaClient.service.findUnique({
          where: { id: service.serviceId },
        });

        if (!serviceExists) {
          return reply.code(404).send({ message: "Service not found" });
        }
      }

      const schedule = await prismaClient.$transaction(async (prisma) => {
        const schedule = await prisma.schedule.create({
          data: {
            customerEmail: body.costumerEmail,
            customerName: body.costumerName,
            customerPhone: body.costumerPhone,
            date: body.date,
            companyId: body.companyId,
            userId: company.userId,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        for (const product of body.products) {
          await prisma.scheduleProduct.create({
            data: {
              productId: product.productId,
              discount: product.discount,
              quantity: product.quantity,
              scheduleId: schedule.id,
            },
          });
        }

        for (const service of body.services) {
          await prisma.scheduleService.create({
            data: {
              scheduleId: schedule.id,
              serviceId: service.serviceId,
            },
          });
        }
      });

      return reply.status(201).send(schedule);
    } catch (error) {
      throw error;
    }
  }
}
