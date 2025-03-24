import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prismaClient } from "../lib/prismaClient";

const schema = z.object({
  userId: z.string().uuid(),
  name: z.string(),
  address: z.string(),
  address_number: z.number(),
  zipCode: z.string(),
  cellPhone: z.string(),
  photo: z.string().optional(),
});

export class CompanyController {
  static async create(request: FastifyRequest, reply: FastifyReply) {
    const body = schema.parse(request.body);

    try {
      //Verify if user exists
      const user = await prismaClient.user.findUnique({
        where: { id: body.userId },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Verify if company already exists for same user
      const companyExists = await prismaClient.company.findFirst({
        where: { userId: body.userId, AND: { name: body.name } },
      });

      if (companyExists) {
        return reply.code(400).send({ message: "Company already exists" });
      }

      const company = await prismaClient.company.create({
        data: {
          userId: body.userId,
          address: body.address,
          addressNumber: body.address_number,
          zipCode: body.zipCode,
          cellPhone: body.cellPhone,
          name: body.name,
          photo: body.photo,
          createdAt: new Date(),
        },
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
      const company = await prismaClient.company.findUnique({
        where: {
          id,
        },
      });

      if (!company) {
        return reply.code(404).send({ message: "Company not found" });
      }
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
      const companies = await prismaClient.company.findMany({
        where: {
          userId,
        },
      });

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
      const user = await prismaClient.user.findUnique({
        where: { id: body.userId },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Verify if company exists
      const companyExists = await prismaClient.company.findUnique({
        where: { id },
      });

      if (!companyExists) {
        return reply.code(404).send({ message: "Company not found" });
      }

      // update company
      const company = await prismaClient.company.update({
        where: {
          id,
        },
        data: {
          ...body,
        },
      });

      return reply.status(200).send(company);
    } catch (error) {
      throw error;
    }
  }
}
