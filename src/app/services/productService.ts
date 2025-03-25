import { Prisma } from "@prisma/client";
import { prismaClient } from "../lib/prismaClient";

export class ProductService {
  static async create(data: Prisma.ProductUncheckedCreateInput) {
    return prismaClient.product.create({ data });
  }

  static async findById(id: string) {
    return prismaClient.product.findUnique({
      where: { id },
    });
  }

  static async findAll(companyId: string) {
    return prismaClient.product.findMany({
      where: {
        companyId,
      },
    });
  }

  static async delete(id: string) {
    return prismaClient.product.delete({
      where: { id },
    });
  }

  static async update(id: string, data: Prisma.ProductUncheckedUpdateInput) {
    return prismaClient.product.update({ where: { id }, data });
  }
}
