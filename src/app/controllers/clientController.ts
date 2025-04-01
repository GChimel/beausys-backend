import { hash } from "bcryptjs";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ClientService } from "../services/clientService";
import { CompanyService } from "../services/companyService";

export class ClientController {
  static async create(request: FastifyRequest, reply: FastifyReply) {
    const schema = z.object({
      companyId: z.string().uuid(),
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
      cellPhone: z.string(),
      googleId: z.string().optional(),
      photo: z.string().optional(),
    });

    const body = schema.parse(request.body);

    try {
      // Verify if company exists
      const company = await CompanyService.findById(body.companyId);

      if (!company) {
        return reply.code(404).send({ message: "Company not found" });
      }

      // Verify if client email already exists
      const emailExists = await ClientService.findByEmail(body.email);

      if (emailExists) {
        return reply.code(400).send({ message: "Email already exists" });
      }

      const hashedPassword = await hash(body.password, 8);

      const client = await ClientService.create({
        ...body,
        password: hashedPassword,
        registeredAt: new Date(),
      });

      return reply.code(201).send(client);
    } catch (error) {
      throw error;
    }
  }
}
