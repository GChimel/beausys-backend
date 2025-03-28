import {
  addDays,
  endOfWeek,
  setHours,
  setMinutes,
  setSeconds,
  startOfWeek,
} from "date-fns";
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

  static async createWeekSchedule(companyId: string) {
    const now = new Date();

    // Monday and Sunday
    const startOfCurrentWeek = startOfWeek(now, { weekStartsOn: 1 });
    const endOfCurrentWeek = endOfWeek(now, { weekStartsOn: 1 });

    const schedules = [];

    for (let i = 0; i < 7; i++) {
      const day = addDays(startOfCurrentWeek, i);

      const startTime = setSeconds(setMinutes(setHours(day, 1), 0), 0);
      const endTime = setSeconds(setMinutes(setHours(day, 12), 0), 0);

      schedules.push({
        companyId,
        date: day,
        startTime,
        endTime,
        isBooked: false,
      });
    }

    return prismaClient.availableSchedule.createMany({
      data: schedules,
      skipDuplicates: true,
    });
  }

  static async resetWeekSchedules(companyId: string) {
    // Delete all old schedules and create new ones
    await prismaClient.availableSchedule.deleteMany({ where: { companyId } });
    return this.createWeekSchedule(companyId);
  }
}
