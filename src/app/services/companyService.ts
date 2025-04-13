import { Prisma } from "@prisma/client";
import { prismaClient } from "../lib/prismaClient";

export class CompanyService {
  static async findById(id: string) {
    return prismaClient.company.findUnique({ where: { id } });
  }

  static async create(data: Prisma.CompanyUncheckedCreateInput) {
    return prismaClient.company.create({ data });
  }

  static async findByUserId(userId: string, companyName: string) {
    return prismaClient.company.findFirst({
      where: {
        userId,
        name: {
          contains: companyName,
        },
      },
    });
  }

  static async findAll(userId: string) {
    return prismaClient.company.findMany({ where: { userId } });
  }

  static async findByEmailAndUserId(email: string, userId: string) {
    return prismaClient.company.findFirst({
      where: {
        userId,
        AND: { email },
      },
    });
  }

  static async update(
    companyId: string,
    data: Prisma.CompanyUncheckedUpdateInput
  ) {
    return prismaClient.company.update({ where: { id: companyId }, data });
  }

  static async delete(companyId: string) {
    return prismaClient.company.delete({ where: { id: companyId } });
  }
}
