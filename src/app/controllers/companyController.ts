import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prismaClient } from "../lib/prismaClient";

export class CompanyController {
  static async create(request: FastifyRequest, reply: FastifyReply) {
    const schema = z.object({
      userId: z.string().uuid(),
      name: z.string(),
      address: z.string(),
      address_number: z.number(),
      zipCode: z.string(),
      cellPhone: z.string(),
      photo: z.string().optional(),
    });

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
}
