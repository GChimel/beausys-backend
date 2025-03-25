import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { CompanyService } from "../services/companyService";
import { ServiceService } from "../services/serviceService";

const schema = z.object({
  companyId: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  expectedTime: z.string(),
  photo: z.string().optional(),
});

export class ServiceController {
  static async create(request: FastifyRequest, reply: FastifyReply) {
    const body = schema.parse(request.body);
    try {
      // Verify if company exists
      const company = await CompanyService.findById(body.companyId);

      if (!company) {
        return reply.code(404).send({ message: "Company not found" });
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

    try {
      // Verify if company exists
      const company = await CompanyService.findById(companyId);

      if (!company) {
        return reply.code(404).send({ message: "Company not found" });
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

    try {
      const service = await ServiceService.findById(id);

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
      const company = await CompanyService.findById(body.companyId);

      if (!company) {
        return reply.code(404).send({ message: "Company not found" });
      }

      const service = await ServiceService.findById(id);

      if (!service) {
        return reply.code(404).send({ message: "Service not found" });
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

    try {
      const service = await ServiceService.findById(id);

      if (!service) {
        return reply.code(404).send({ message: "Service not found" });
      }

      await ServiceService.delete(id);

      return reply.status(204).send();
    } catch (error) {
      throw error;
    }
  }
}
