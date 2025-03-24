import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prismaClient } from "../lib/prismaClient";

const schema = z.object({
  companyId: z.string().uuid(),
  name: z.string(),
  price: z.number(),
  description: z.string(),
  photo: z.string().optional(),
});

export class ProductController {
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

      const product = await prismaClient.product.create({
        data: {
          ...body,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return reply.status(201).send(product);
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
      const product = await prismaClient.product.findUnique({
        where: {
          id,
        },
      });

      if (!product) {
        return reply.code(404).send({ message: "Product not found" });
      }

      return reply.status(200).send(product);
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

      const products = await prismaClient.product.findMany({
        where: {
          companyId,
        },
      });

      return reply.status(200).send(products);
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
      // Verify if product exists
      const product = await prismaClient.product.findUnique({
        where: { id },
      });

      if (!product) {
        return reply.code(404).send({ message: "Product not found" });
      }

      await prismaClient.product.delete({
        where: {
          id,
        },
      });

      return reply.status(204).send();
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
      // Verify if product exists
      const product = await prismaClient.product.findUnique({
        where: { id },
      });

      if (!product) {
        return reply.code(404).send({ message: "Product not found" });
      }

      const updatedProduct = await prismaClient.product.update({
        where: {
          id,
        },
        data: {
          ...body,
          updatedAt: new Date(),
        },
      });

      return reply.status(200).send(updatedProduct);
    } catch (error) {
      throw error;
    }
  }
}
