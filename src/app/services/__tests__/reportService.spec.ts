import { prismaClient } from "../../lib/prismaClient";
import { ReportService } from "../reportService";

jest.mock("../../lib/prismaClient", () => ({
  prismaClient: {
    schedule: {
      findMany: jest.fn(),
    },
    product: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
    service: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
    client: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}));

describe("ReportService", () => {
  describe("scheduleSummary", () => {
    it("should return the correct schedule summary", async () => {
      const companyId = "123";
      const startDate = new Date("2023-01-01");
      const endDate = new Date("2023-01-31");

      (prismaClient.schedule.findMany as jest.Mock).mockResolvedValue([
        {
          id: "1",
          companyId,
          clientId: "456",
          situation: "CONFIRMED",
          createdAt: new Date("2023-01-01"),
          updatedAt: new Date("2023-01-01"),
        },
      ]);

      const result = await ReportService.scheduleSummary(
        companyId,
        startDate,
        endDate
      );

      expect(result).toEqual({
        totalSchedules: 1,
      });
    });
  });

  describe("productStock", () => {
    it("should return the correct product stock", async () => {
      const companyId = "123";

      (prismaClient.product.findMany as jest.Mock).mockResolvedValue([
        {
          id: "1",
          companyId,
          name: "Product 1",
          quantity: 10,
          price: 100,
        },
      ]);

      const response = await ReportService.productStock(companyId);

      expect(response.products).toEqual([
        {
          id: "1",
          companyId,
          name: "Product 1",
          quantity: 10,
          price: 100,
        },
      ]);
    });
  });

  describe("serviceSummary", () => {
    it("should return the correct service summary", async () => {
      const companyId = "123";

      (prismaClient.service.findMany as jest.Mock).mockResolvedValue([
        {
          id: "1",
          companyId,
          name: "Service 1",
          price: 100,
        },
      ]);

      const response = await ReportService.serviceSummary(companyId);

      expect(response.services).toEqual([
        {
          id: "1",
          companyId,
          name: "Service 1",
          price: 100,
        },
      ]);
    });
  });

  describe("clientSummary", () => {
    it("should return the correct client summary", async () => {
      const companyId = "123";

      (prismaClient.client.findMany as jest.Mock).mockResolvedValue([
        {
          id: "1",
          companyId,
          name: "Client 1",
        },
      ]);

      const response = await ReportService.clientSummary(companyId);

      expect(response.clients).toEqual([
        {
          id: "1",
          companyId,
          name: "Client 1",
        },
      ]);
    });
  });
});
