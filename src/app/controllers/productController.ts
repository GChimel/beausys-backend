import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { getUserId } from "../helper/getUserId";
import { CompanyService } from "../services/companyService";
import { ProductService } from "../services/productService";

const schema = z.object({
  companyId: z.string().uuid(),
  name: z.string(),
  price: z.number(),
  quantity: z.number().int(),
  description: z.string(),
  photo: z.string().optional(),
});

export class ProductController {
  static async create(request: FastifyRequest, reply: FastifyReply) {
    const body = schema.parse(request.body);
    const userId = getUserId(request);

    try {
      // Verify if company exists
      const company = await CompanyService.findById(body.companyId);

      if (!company || company.userId !== userId) {
        return reply.code(403).send({ message: "Forbidden" });
      }

      const product = await ProductService.create({
        ...body,
        createdAt: new Date(),
        updatedAt: new Date(),
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
    const userId = getUserId(request);

    try {
      const product = await ProductService.findById(id);

      if (!product) {
        return reply.code(404).send({ message: "Product not found" });
      }

      const company = await CompanyService.findById(product?.companyId);

      if (!company || company.userId !== userId) {
        return reply.code(403).send({ message: "Forbidden" });
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

    const userId = getUserId(request);

    try {
      // Verify if company exists
      const company = await CompanyService.findById(companyId);

      if (!company || company.userId !== userId) {
        return reply.code(403).send({ message: "Forbidden" });
      }

      const products = await ProductService.findAll(companyId);

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

    const userId = getUserId(request);

    try {
      // Verify if product exists
      const product = await ProductService.findById(id);

      if (!product) {
        return reply.code(404).send({ message: "Product not found" });
      }

      const company = await CompanyService.findById(product.companyId);

      if (!company || company.userId !== userId) {
        return reply.code(403).send({ message: "Forbidden" });
      }

      await ProductService.delete(id);

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
    const userId = getUserId(request);

    try {
      // Verify if product exists
      const product = await ProductService.findById(id);

      if (!product) {
        return reply.code(404).send({ message: "Product not found" });
      }

      const company = await CompanyService.findById(product.companyId);

      if (!company || company.userId !== userId) {
        return reply.code(403).send({ message: "Forbidden" });
      }

      const updatedProduct = await ProductService.update(id, body);

      return reply.status(200).send(updatedProduct);
    } catch (error) {
      throw error;
    }
  }
}
