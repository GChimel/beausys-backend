import { Prisma } from "@prisma/client";
import { prismaClient } from "../lib/prismaClient";

export class UserService {
  static async findById(id: string) {
    return prismaClient.user.findUnique({ where: { id } });
  }

  static async findByEmail(email: string) {
    return prismaClient.user.findUnique({ where: { email } });
  }

  static async create(data: Prisma.UserUncheckedCreateInput) {
    return prismaClient.user.create({ data });
  }

  static async update(id: string, data: Prisma.UserUncheckedUpdateInput) {
    return prismaClient.user.update({ where: { id }, data });
  }
}
