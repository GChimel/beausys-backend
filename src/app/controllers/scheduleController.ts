import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prismaClient } from "../lib/prismaClient";
import { CompanyService } from "../services/companyService";
import { ProductService } from "../services/productService";
import { ScheduleService } from "../services/scheduleService";
import { ServiceService } from "../services/serviceService";

export class ScheduleController {
  static async create(request: FastifyRequest, reply: FastifyReply) {
    const schema = z.object({
      companyId: z.string().uuid(),
      clientId: z.string().uuid(),
      availableSchedule: z.string().uuid(),
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
      const company = await CompanyService.findById(body.companyId);

      if (!company) {
        return reply.code(404).send({ message: "Company not found" });
      }

      for (const product of body.products) {
        // Verify if product exists
        const productExists = await ProductService.findById(product.productId);

        if (!productExists) {
          return reply.code(404).send({ message: "Product not found" });
        }
      }

      for (const service of body.services) {
        // Verify if service exists
        const serviceExists = await ServiceService.findById(service.serviceId);

        if (!serviceExists) {
          return reply.code(404).send({ message: "Service not found" });
        }
      }

      const schedule = await prismaClient.$transaction(async (prisma) => {
        const schedule = await ScheduleService.create({
          clientId: body.clientId,
          companyId: body.companyId,
          createdAt: new Date(),
          updatedAt: new Date(),
          availableId: body.availableSchedule,
        });

        for (const product of body.products) {
          await ScheduleService.createScheduleProducts({
            productId: product.productId,
            discount: product.discount,
            quantity: product.quantity,
            scheduleId: schedule.id,
          });
        }

        for (const service of body.services) {
          await ScheduleService.createScheduleServices({
            scheduleId: schedule.id,
            serviceId: service.serviceId,
          });
        }
      });

      return reply.status(201).send(schedule);
    } catch (error) {
      throw error;
    }
  }

  static async findAll(request: FastifyRequest, reply: FastifyReply) {
    const { companyId } = z
      .object({
        companyId: z.string().uuid(),
      })
      .parse(request.query);

    try {
      const schedules = await ScheduleService.findAll(companyId);

      return reply.status(200).send(schedules);
    } catch (error) {
      throw error;
    }
  }

  static async findById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = z
      .object({
        id: z.string().uuid(),
      })
      .parse(request.params);

    try {
      const schedule = await ScheduleService.findById(id);

      if (!schedule) {
        return reply.code(404).send({ message: "Schedule not found" });
      }

      return reply.code(200).send(schedule);
    } catch (error) {
      throw error;
    }
  }

  static async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = z
      .object({
        id: z.string().uuid(),
      })
      .parse(request.params);

    try {
      const schedule = await ScheduleService.findById(id);

      if (!schedule) {
        return reply.code(404).send({ message: "Schedule not found" });
      }

      await ScheduleService.delete(id);

      return reply.status(204).send();
    } catch (error) {
      throw error;
    }
  }
}
