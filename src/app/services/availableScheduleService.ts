import { Prisma } from "@prisma/client";
import { prismaClient } from "../lib/prismaClient";

export class AvailableScheduleService {
  static async findAll(companyId: string, initialDate: Date, finalDate: Date) {
    return prismaClient.availableSchedule.findMany({
      where: {
        companyId,
        AND: [
          { startTime: { gte: initialDate } },
          { endTime: { lte: finalDate } },
        ],
      },
    });
  }

  static async create(data: Prisma.AvailableScheduleUncheckedCreateInput) {
    return prismaClient.availableSchedule.create({ data });
  }

  static async findById(id: string) {
    return prismaClient.availableSchedule.findUnique({
      where: { id },
    });
  }

  static async udpate(
    id: string,
    data: Prisma.AvailableScheduleUncheckedUpdateInput
  ) {
    return prismaClient.availableSchedule.update({ where: { id }, data });
  }
}
