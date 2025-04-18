import { Prisma } from "@prisma/client";
import { prismaClient } from "../lib/prismaClient";

export class ClientService {
  static async create(data: Prisma.ClientUncheckedCreateInput) {
    return prismaClient.client.create({ data: data });
  }

  static async findById(id: string) {
    return prismaClient.client.findUnique({ where: { id } });
  }

  static async findAll(companyId: string) {
    return prismaClient.client.findMany({ where: { companyId } });
  }

  static async findByEmail(companyId: string, email: string) {
    return prismaClient.client.findFirst({
      where: {
        email,
        companyId,
      },
    });
  }

  static async findByName(companyId: string, name: string) {
    return prismaClient.client.findMany({
      where: {
        name: { contains: name, mode: "insensitive" },
        companyId,
      },
    });
  }
}
