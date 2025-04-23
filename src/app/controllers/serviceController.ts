import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { getUserId } from "../helper/getUserId";
import { CompanyService } from "../services/companyService";
import { ServiceService } from "../services/serviceService";

const schema = z.object({
  companyId: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  expectedMinutes: z.number().int(),
  photo: z.string().optional(),
});

export class ServiceController {
  static async create(request: FastifyRequest, reply: FastifyReply) {
    const body = schema.parse(request.body);
    const userId = getUserId(request);

    try {
      // Verify if company exists
      const company = await CompanyService.findById(body.companyId);

      if (!company) {
        return reply.code(404).send({ message: "Company not found" });
      }

      if (company.userId !== userId) {
        return reply.code(403).send({ message: "Forbidden" });
      }

      const service = await ServiceService.create({
        ...body,
        createdAt: new Date(),
        updatedAt: new Date(),
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

    const userId = getUserId(request);

    try {
      // Verify if company exists
      const company = await CompanyService.findById(companyId);

      if (!company) {
        return reply.code(404).send({ message: "Company not found" });
      }

      if (company.userId !== userId) {
        return reply.code(403).send({ message: "Forbidden" });
      }

      const services = await ServiceService.findAll(companyId);

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
    const userId = getUserId(request);

    try {
      const service = await ServiceService.findById(id);

      if (!service) {
        return reply.code(404).send({ message: "Service not found" });
      }

      if (service.company.userId !== userId) {
        return reply.code(403).send({ message: "Forbidden" });
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
    const userId = getUserId(request);

    try {
      // Verify if company exists
      const company = await CompanyService.findById(body.companyId);

      if (!company) {
        return reply.code(404).send({ message: "Company not found" });
      }

      const service = await ServiceService.findById(id);

      if (!service) {
        return reply.code(404).send({ message: "Service not found" });
      }

      if (service.company.userId !== userId && company.userId !== userId) {
        return reply.code(403).send({ message: "Forbidden" });
      }

      const updatedService = await ServiceService.update(id, {
        ...body,
        updatedAt: new Date(),
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

    const userId = getUserId(request);

    try {
      const service = await ServiceService.findById(id);

      if (!service) {
        return reply.code(404).send({ message: "Service not found" });
      }

      if (service.company.userId !== userId) {
        return reply.code(403).send({ message: "Forbidden" });
      }

      await ServiceService.delete(id);

      return reply.status(204).send();
    } catch (error) {
      throw error;
    }
  }
}
