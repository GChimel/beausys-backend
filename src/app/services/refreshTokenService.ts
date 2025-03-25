import { Prisma } from "@prisma/client";
import { prismaClient } from "../lib/prismaClient";

export class RefreshTokenService {
  static async create(data: Prisma.RefreshTokenUncheckedCreateInput) {
    return prismaClient.refreshToken.create({ data });
  }

  static async findById(id: string) {
    return prismaClient.refreshToken.findUnique({ where: { id } });
  }

  static async delete(id: string) {
    return prismaClient.refreshToken.delete({ where: { id } });
  }
}
