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

  static async productStock(companyId: string) {
    const [products, count] = await Promise.all([
      prismaClient.product.findMany({
        where: {
          companyId,
        },
        select: {
          id: true,
          name: true,
          quantity: true,
          price: true,
        },
      }),
      prismaClient.product.count({
        where: {
          companyId,
        },
      }),
    ]);

    return {
      products,
      totalProducts: count,
    };
  }

  static async serviceSummary(companyId: string) {
    const [services, count] = await Promise.all([
      prismaClient.service.findMany({
        where: { companyId },

        select: {
          id: true,
          name: true,
          price: true,
        },
      }),
      prismaClient.service.count({
        where: { companyId },
      }),
    ]);

    return {
      services,
      totalServices: count,
    };
  }

  static async clientSummary(companyId: string) {
    const [clients, count] = await Promise.all([
      prismaClient.client.findMany({
        where: { companyId },
        select: {
          id: true,
          name: true,
          email: true,
          cellPhone: true,
        },
      }),
      prismaClient.client.count({
        where: { companyId },
      }),
    ]);

    return {
      clients,
      totalClients: count,
    };
  }
}
