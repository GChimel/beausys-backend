import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { differenceInMinutes } from "date-fns";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prismaClient } from "../lib/prismaClient";
import { AvailableScheduleService } from "../services/availableScheduleService";
import { ClientService } from "../services/clientService";
import { CompanyService } from "../services/companyService";
import { ProductService } from "../services/productService";
import { ScheduleService } from "../services/scheduleService";
import { ServiceService } from "../services/serviceService";

export class ScheduleController {
  static async create(request: FastifyRequest, reply: FastifyReply) {
    const schema = z.object({
      companyId: z.string().uuid(),
      clientId: z.string().uuid(),
      availableScheduleId: z.string().uuid(),
      products: z
        .array(
          z.object({
            productId: z.string().uuid(),
            quantity: z.number(),
            discount: z.number().optional(),
          })
        )
        .optional(),
      services: z.array(
        z.object({
          serviceId: z.string().uuid(),
        })
      ),
    });

    const body = schema.parse(request.body);

    try {
      // Verify if company exists
      const company = await CompanyService.findById(body.companyId);
      // Verify if client exists
      const client = await ClientService.findById(body.clientId);
      // Verify if available schedule exits
      const availableSchedule = await AvailableScheduleService.findById(
        body.availableScheduleId
      );

      if (!company) {
        return reply.code(404).send({ message: "Company not found" });
      }

      if (!client) {
        return reply.code(404).send({ message: "Client not found" });
      }

      if (!availableSchedule) {
        return reply
          .code(404)
          .send({ message: "Available schedule not found" });
      }

      if (body.products) {
        console.log("aqui");
        for (const product of body.products) {
          // Verify if product exists
          const productExists = await ProductService.findById(
            product.productId
          );

          if (!productExists) {
            return reply.code(404).send({ message: "Product not found" });
          }
        }
      }

      let expectedServiceTime = 0;

      for (const service of body.services) {
        // Verify if service exists
        const serviceExists = await ServiceService.findById(service.serviceId);

        if (!serviceExists) {
          return reply.code(404).send({ message: "Service not found" });
        }

        expectedServiceTime += serviceExists.expectedMinutes;
      }

      // Verify if available minutes is greater than expected service time
      let status = 0;

      const availableMinutes = differenceInMinutes(
        new Date(availableSchedule.endTime),
        new Date(availableSchedule.startTime)
      );

      // If available minutes is less than expected service time then status is PENDING
      if (availableMinutes < expectedServiceTime) {
        status = 0;
      }

      const schedule = await prismaClient.$transaction(async () => {
        const schedule = await ScheduleService.create({
          clientId: body.clientId,
          companyId: body.companyId,
          createdAt: new Date(),
          updatedAt: new Date(),
          availableId: body.availableScheduleId,
          situation: status === 0 ? "PENDING" : "CONFIRMED",
        });

        if (body.products) {
          for (const product of body.products) {
            await ScheduleService.createScheduleProducts({
              productId: product.productId,
              discount: product.discount,
              quantity: product.quantity,
              scheduleId: schedule.id,
            });
          }
        }

        for (const service of body.services) {
          await ScheduleService.createScheduleServices({
            scheduleId: schedule.id,
            serviceId: service.serviceId,
          });
        }

        // Update available schedule status
        await AvailableScheduleService.udpate(body.availableScheduleId, {
          isBooked: true,
        });
      });

      return reply.status(201).send(schedule);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          return reply.code(409).send({
            message: "Schedule with this available schedule already exists",
          });
        }
      }
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

      await Promise.all([
        await AvailableScheduleService.udpate(schedule.availableId, {
          isBooked: false,
        }),

        await ScheduleService.delete(id),
      ]);

      return reply.status(204).send();
    } catch (error) {
      throw error;
    }
  }
}
