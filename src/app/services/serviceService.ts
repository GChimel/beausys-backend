import { Prisma } from "@prisma/client";
import { prismaClient } from "../lib/prismaClient";

export class ServiceService {
  static async create(data: Prisma.ServiceUncheckedCreateInput) {
    return prismaClient.service.create({ data });
  }

  static async findById(id: string) {
    return prismaClient.service.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            userId: true,
          },
        },
      },
    });
  }

  static async findAll(companyId: string) {
    return prismaClient.service.findMany({
      where: {
        companyId,
      },
    });
  }

  static async update(id: string, data: Prisma.ServiceUncheckedUpdateInput) {
    return prismaClient.service.update({ where: { id }, data });
  }

  static async delete(id: string) {
    return prismaClient.service.delete({ where: { id } });
  }
}
