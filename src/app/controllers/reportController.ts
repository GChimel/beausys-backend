import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { adjustToEndOfDay, adjustToStartOfDay } from "../helper/dateHelper";
import { ReportService } from "../services/reportService";

export class ReportController {
  static async scheduleSummary(request: FastifyRequest, reply: FastifyReply) {
    const schema = z.object({
      companyId: z.string().uuid(),
      startDate: z.string().transform(adjustToStartOfDay),
      endDate: z.string().transform(adjustToEndOfDay),
    });

    const { companyId, startDate, endDate } = schema.parse(request.query);

    const report = await ReportService.scheduleSummary(
      companyId as string,
      startDate,
      endDate
    );

    return reply.status(200).send(report);
  }

  static async productStock(request: FastifyRequest, reply: FastifyReply) {
    const schema = z.object({
      companyId: z.string().uuid(),
    });

    const { companyId } = schema.parse(request.query);

    const report = await ReportService.productStock(companyId);

    return reply.status(200).send(report);
  }

  static async serviceSummary(request: FastifyRequest, reply: FastifyReply) {
    const schema = z.object({
      companyId: z.string().uuid(),
    });

    const { companyId } = schema.parse(request.query);

    const report = await ReportService.serviceSummary(companyId);

    return reply.status(200).send(report);
  }

  static async clientSummary(request: FastifyRequest, reply: FastifyReply) {
    const schema = z.object({
      companyId: z.string().uuid(),
    });

    const { companyId } = schema.parse(request.query);

    const report = await ReportService.clientSummary(companyId);

    return reply.status(200).send(report);
  }
}
