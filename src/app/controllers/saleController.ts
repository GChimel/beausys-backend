import { Prisma } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { getUserId } from "../helper/getUserId";
import { ClientService } from "../services/clientService";
import { CompanyService } from "../services/companyService";
import { SaleService } from "../services/saleService";
import { ScheduleService } from "../services/scheduleService";

export class SaleController {
  static async create(request: FastifyRequest, reply: FastifyReply) {
    const schema = z.object({
      companyId: z.string().uuid(),
      clientId: z.string().uuid(),
      scheduleId: z.string().uuid().optional(),
      total: z.number(),
      products: z
        .array(
          z.object({
            productId: z.string().uuid(),
            quantity: z.number().int(),
            discount: z.number().optional(),
          })
        )
        .optional(),
    });

    const body = schema.parse(request.body);
    const userId = getUserId(request);

    try {
      const client = await ClientService.findById(body.clientId);
      const company = await CompanyService.findById(body.companyId);

      if (!client) {
        return reply.code(404).send({ message: "Client not found" });
      }

      if (!company) {
        return reply.code(404).send({ message: "Company not found" });
      }

      if (company.userId !== userId) {
        return reply.code(403).send({ message: "Forbidden" });
      }

      if (body.scheduleId) {
        const schedule = await ScheduleService.findById(body.scheduleId);

        if (!schedule) {
          return reply.code(404).send({ message: "Schedule not found" });
        }

        if (schedule.companyId !== body.companyId) {
          return reply
            .code(400)
            .send({ message: "Schedule does not belong to company" });
        }
      }

      const saleData = {
        createdAt: new Date(),
        isDeleted: false,
        total: body.total,
        companyId: body.companyId,
        clientId: body.clientId,
        scheduleId: body.scheduleId || null,
      };

      let products: {
        productId: string;
        quantity: number;
        discount: number | undefined;
      }[] = [];

      if (body.products) {
        products = body.products.map((product) => {
          return {
            productId: product.productId,
            quantity: product.quantity,
            discount: product.discount,
          };
        });
      }

      await SaleService.create(
        saleData,
        products as Prisma.SaleProductUncheckedCreateInput[]
      );

      return reply.code(201).send();
    } catch (error) {
      throw error;
    }
  }
}
