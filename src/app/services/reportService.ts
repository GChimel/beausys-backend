import { prismaClient } from "../lib/prismaClient";

export class ReportService {
  static async scheduleSummary(
    companyId: string,
    startDate: Date,
    endDate: Date
  ) {
    const schedules = await prismaClient.schedule.findMany({
      where: {
        companyId,
        availableSchedule: {
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
      },
    });

    const totalSchedules = schedules.length;

    return {
      totalSchedules,
    };
  }
}
