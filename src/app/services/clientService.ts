import { Prisma } from "@prisma/client";
import { prismaClient } from "../lib/prismaClient";

export class ClientService {
  static async create(data: Prisma.ClientUncheckedCreateInput) {
    return prismaClient.client.create({ data: data });
  }

  static async findAll() {
    return prismaClient.client.findMany();
  }

  static async findByEmail(email: string) {
    return prismaClient.client.findUnique({ where: { email } });
  }
}
