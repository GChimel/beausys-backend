import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { getUserId } from "../helper/getUserId";
import { CompanyService } from "../services/companyService";
import { UserService } from "../services/userService";

const schema = z.object({
  name: z.string(),
  email: z.string().email(),
  color: z.string().refine(
    (val) => {
      if (!val) return true;
      return /^#([0-9A-F]{3}){1,2}$/i.test(val);
    },
    {
      message: "Color must be a HEX",
    }
  ),
  address: z.string(),
  addressNumber: z.number(),
  zipCode: z.string(),
  cellPhone: z.string(),
  photo: z.string().optional(),
});

export class CompanyController {
  static async create(request: FastifyRequest, reply: FastifyReply) {
    const body = schema.parse(request.body);
    const userId = getUserId(request);

    try {
      //Verify if user exists
      const user = await UserService.findById(userId);

      if (!user) {
        return reply.code(404).send({ message: "User not found" });
      }

      // Verify if company already exists for same user
      const [companyNameExists, companyEmailExists] = await Promise.all([
        CompanyService.findByUserIdAndName(userId, body.name),
        CompanyService.findByEmail(body.email),
      ]);

      if (companyNameExists || companyEmailExists) {
        return reply.code(400).send({ message: "Company already exists" });
      }

      const company = await CompanyService.create({
        userId,
        ...body,
        createdAt: new Date(),
      });

      return reply.code(201).send(company);
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
      const company = await CompanyService.findById(id);

      if (!company) {
        return reply.code(404).send({ message: "Company not found" });
      }

      return reply.status(200).send(company);
    } catch (error) {
      throw error;
    }
  }

  static async findAll(request: FastifyRequest, reply: FastifyReply) {
    const userId = getUserId(request);

    try {
      const companies = await CompanyService.findAll(userId);

      return reply.status(200).send(companies);
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
      const companyExists = await CompanyService.findById(id);

      if (!companyExists) {
        return reply.code(404).send({ message: "Company not found" });
      }

      if (companyExists.userId !== userId) {
        return reply.code(403).send({ message: "Forbidden" });
      }

      // update company
      const company = await CompanyService.update(id, body);

      return reply.status(200).send(company);
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
      // Verify if company exists
      const company = await CompanyService.findById(id);

      if (!company) {
        return reply.code(404).send({ message: "Company not found" });
      }

      if (company.userId !== userId) {
        return reply.code(403).send({ message: "Forbidden" });
      }

      await CompanyService.delete(id);

      return reply.status(204).send();
    } catch (error) {
      throw error;
    }
  }
}
