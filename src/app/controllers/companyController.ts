import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { CompanyService } from "../services/companyService";
import { UserService } from "../services/userService";

const schema = z.object({
  userId: z.string().uuid(),
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

    try {
      //Verify if user exists
      const user = await UserService.findById(body.userId);

      if (!user) {
        return reply.code(404).send({ message: "User not found" });
      }

      // Verify if company already exists for same user
      const companyNameExists = await CompanyService.findByUserId(
        body.userId,
        body.name
      );

      const companyEmailExists = await CompanyService.findByEmailAndUserId(
        body.email,
        body.userId
      );

      if (companyNameExists || companyEmailExists) {
        return reply.code(400).send({ message: "Company already exists" });
      }

      const company = await CompanyService.create({
        userId: body.userId,
        address: body.address,
        email: body.email,
        color: body.color,
        addressNumber: body.addressNumber,
        zipCode: body.zipCode,
        cellPhone: body.cellPhone,
        name: body.name,
        photo: body.photo,
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
    const { userId } = z
      .object({
        userId: z.string().uuid(),
      })
      .parse(request.query);

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

    try {
      //Verify if user exists
      const user = await UserService.findById(body.userId);

      if (!user) {
        throw new Error("User not found");
      }

      // Verify if company exists
      const companyExists = await CompanyService.findById(id);

      if (!companyExists) {
        return reply.code(404).send({ message: "Company not found" });
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

    try {
      // Verify if company exists
      const company = await CompanyService.findById(id);

      if (!company) {
        return reply.code(404).send({ message: "Company not found" });
      }

      await CompanyService.delete(id);

      return reply.status(204).send();
    } catch (error) {
      throw error;
    }
  }
}
