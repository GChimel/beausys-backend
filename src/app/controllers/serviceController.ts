import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prismaClient } from "../lib/prismaClient";

const schema = z.object({
  companyId: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  expectedTime: z.string(),
  photo: z.string().optional(),
});

export class ServiceController {
  static async create(request: FastifyRequest, reply: FastifyReply) {
    const body = schema.parse(request.body);
    try {
      // Verify if company exists
      const company = await prismaClient.company.findUnique({
        where: { id: body.companyId },
      });

      if (!company) {
        return reply.code(404).send({ message: "Company not found" });
      }

      const service = await prismaClient.service.create({
        data: {
          ...body,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return reply.status(201).send(service);
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
      // Verify if company exists
      const company = await prismaClient.company.findUnique({
        where: { id: companyId },
      });

      if (!company) {
        return reply.code(404).send({ message: "Company not found" });
      }

      const services = await prismaClient.service.findMany({
        where: {
          companyId,
        },
      });

      return reply.status(200).send(services);
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
      const service = await prismaClient.service.findUnique({
        where: { id },
      });

      if (!service) {
        return reply.code(404).send({ message: "Service not found" });
      }

      return reply.code(200).send(service);
    } catch (error) {
      throw error;
    }
  }

  static async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = z
      .object({
        id: z.string().uuid(),
      })
      .parse(request.params);

    const body = schema.parse(request.body);

    try {
      // Verify if company exists
      const company = await prismaClient.company.findUnique({
        where: { id: body.companyId },
      });

      if (!company) {
        return reply.code(404).send({ message: "Company not found" });
      }

      const service = await prismaClient.service.findUnique({
        where: { id },
      });

      if (!service) {
        return reply.code(404).send({ message: "Service not found" });
      }

      const updatedService = await prismaClient.service.update({
        where: {
          id,
        },
        data: {
          ...body,
          updatedAt: new Date(),
        },
      });

      return reply.code(200).send(updatedService);
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
      const service = await prismaClient.service.findUnique({
        where: { id },
      });

      if (!service) {
        return reply.code(404).send({ message: "Service not found" });
      }

      await prismaClient.service.delete({
        where: {
          id,
        },
      });

      return reply.status(204).send();
    } catch (error) {
      throw error;
    }
  }
}
