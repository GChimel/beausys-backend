import { Prisma } from "@prisma/client";
import { prismaClient } from "../lib/prismaClient";

export class ScheduleService {
  static async create(data: Prisma.ScheduleUncheckedCreateInput) {
    return prismaClient.schedule.create({ data });
  }

  static async createScheduleProducts(
    data: Prisma.ScheduleProductUncheckedCreateInput
  ) {
    return prismaClient.scheduleProduct.create({ data });
  }

  static async createScheduleServices(
    data: Prisma.ScheduleServiceUncheckedCreateInput
  ) {
    return prismaClient.scheduleService.create({ data });
  }

  static async findAll(companyId: string) {
    return prismaClient.schedule.findMany({ where: { companyId } });
  }

  static async findById(id: string) {
    return prismaClient.schedule.findUnique({ where: { id } });
  }

  static async delete(id: string) {
    return prismaClient.schedule.delete({ where: { id } });
  }
}
