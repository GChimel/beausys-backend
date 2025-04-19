import {
  addMinutes,
  eachDayOfInterval,
  getDay,
  isAfter,
  isBefore,
  parseISO,
} from "date-fns";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { AvailableScheduleService } from "../services/availableScheduleService";
import { CompanyService } from "../services/companyService";

export class AvailableScheduleController {
  static async createAvailableSchedule(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const schema = z.object({
      companyId: z.string().uuid(),
      startTime: z.string(),
      endTime: z.string(),
      intervalInMinutes: z.number().positive(),
      days: z.array(z.number().int().min(0).max(6)),
      periodStart: z.string(),
      periodEnd: z.string(),
    });

    const body = schema.parse(request.body);

    try {
      const company = await CompanyService.findById(body.companyId);
      if (!company) {
        return reply.code(404).send({ message: "Company not found" });
      }

      const periodStart = parseISO(body.periodStart);
      const periodEnd = parseISO(body.periodEnd);

      const allDates = eachDayOfInterval({
        start: periodStart,
        end: periodEnd,
      });
      const validDates = allDates.filter((date) =>
        body.days.includes(getDay(date))
      );

      const schedules = [];

      for (const date of validDates) {
        const startDateTime = parseISO(
          `${date.toISOString().split("T")[0]}T${body.startTime}`
        );
        const endDateTime = parseISO(
          `${date.toISOString().split("T")[0]}T${body.endTime}`
        );

        let currentStart = startDateTime;

        while (isBefore(currentStart, endDateTime)) {
          const currentEnd = addMinutes(currentStart, body.intervalInMinutes);
          if (isAfter(currentEnd, endDateTime)) break;

          schedules.push({
            companyId: body.companyId,
            date: currentStart,
            startTime: currentStart,
            endTime: currentEnd,
            isBooked: false,
          });

          currentStart = currentEnd;
        }
      }

      for (let i = 0; i < schedules.length; i++) {
        await AvailableScheduleService.create(schedules[i]);
      }

      return reply
        .code(201)
        .send({ message: "Schedules created", count: schedules.length });
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ message: "Internal server error" });
    }
  }

  static async findAll(request: FastifyRequest, reply: FastifyReply) {
    const schema = z.object({
      companyId: z.string().uuid(),
      initialDate: z.string(),
      finalDate: z.string(),
    });

    const { initialDate, finalDate, companyId } = schema.parse(request.params);

    try {
      const schedules = await AvailableScheduleService.findAll(
        companyId,
        new Date(initialDate),
        new Date(finalDate)
      );

      return reply.status(200).send(schedules);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
