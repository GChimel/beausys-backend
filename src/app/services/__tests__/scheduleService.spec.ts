import { prismaClient } from "../../lib/prismaClient";
import { ScheduleService } from "../scheduleService";

jest.mock("../../lib/prismaClient", () => ({
  prismaClient: {
    schedule: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    scheduleProduct: {
      create: jest.fn(),
    },
    scheduleService: {
      create: jest.fn(),
    },
  },
}));

enum Situation {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELED = "CANCELED",
  DONE = "DONE",
}

describe("ScheduleService", () => {
  const mockSchedule = {
    id: "1",
    companyId: "efb1a606-fb9e-41b4-90f1-07f9ce813772",
    clientId: "e3e31b28-178c-4059-a886-b0dd44eba8fe",
    availableId: "3212efa6-dff8-4566-b1ef-4ebeb01c6f54",
    situation: Situation.CONFIRMED,
    services: [
      {
        serviceId: "cfb7caa4-e692-4f96-a88c-013688fc8aa5",
      },
    ],
    products: [
      {
        productId: "cfb7caa4-e692-4f96-a88c-013688fc8aa5",
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a schedule successfully", async () => {
      (prismaClient.schedule.create as jest.Mock).mockResolvedValue(
        mockSchedule
      );

      const result = await ScheduleService.create(mockSchedule);

      expect(result).toEqual(mockSchedule);
      expect(prismaClient.schedule.create).toHaveBeenCalledWith({
        data: mockSchedule,
      });
    });
  });

  describe("findAll", () => {
    it("should find all schedules successfully", async () => {
      (prismaClient.schedule.findMany as jest.Mock).mockResolvedValue([
        mockSchedule,
      ]);

      const result = await ScheduleService.findAll(mockSchedule.companyId);

      expect(result).toEqual([mockSchedule]);
      expect(prismaClient.schedule.findMany).toHaveBeenCalled();
    });
  });

  describe("findById", () => {
    it("should find a schedule by id successfully", async () => {
      (prismaClient.schedule.findUnique as jest.Mock).mockResolvedValue(
        mockSchedule
      );

      const result = await ScheduleService.findById(mockSchedule.id);

      expect(result).toEqual(mockSchedule);
      expect(prismaClient.schedule.findUnique).toHaveBeenCalledWith({
        where: { id: mockSchedule.id },
        include: {
          company: {
            select: {
              userId: true,
            },
          },
        },
      });
    });
  });

  describe("delete", () => {
    it("should delete a schedule successfully", async () => {
      (prismaClient.schedule.delete as jest.Mock).mockResolvedValue(
        mockSchedule
      );

      const result = await ScheduleService.delete(mockSchedule.id);

      expect(result).toEqual(mockSchedule);
      expect(prismaClient.schedule.delete).toHaveBeenCalledWith({
        where: { id: mockSchedule.id },
      });
    });
  });

  describe("createScheduleProducts", () => {
    it("should create schedule products successfully", async () => {
      const mockScheduleProduct = {
        id: "product1",
        scheduleId: mockSchedule.id,
        productId: mockSchedule.products[0].productId,
      };
      (prismaClient.scheduleProduct.create as jest.Mock).mockResolvedValue(
        mockScheduleProduct
      );

      const result = await ScheduleService.createScheduleProducts({
        scheduleId: mockSchedule.id,
        productId: mockSchedule.products[0].productId,
      });

      expect(result).toEqual(mockScheduleProduct);
      expect(prismaClient.scheduleProduct.create).toHaveBeenCalledWith({
        data: {
          scheduleId: mockSchedule.id,
          productId: mockSchedule.products[0].productId,
        },
      });
    });
  });

  describe("createScheduleServices", () => {
    it("should create schedule services successfully", async () => {
      const mockScheduleService = {
        id: "service1",
        scheduleId: mockSchedule.id,
        serviceId: mockSchedule.services[0].serviceId,
      };
      (prismaClient.scheduleService.create as jest.Mock).mockResolvedValue(
        mockScheduleService
      );

      const result = await ScheduleService.createScheduleServices({
        scheduleId: mockSchedule.id,
        serviceId: mockSchedule.services[0].serviceId,
      });

      expect(result).toEqual(mockScheduleService);
      expect(prismaClient.scheduleService.create).toHaveBeenCalledWith({
        data: {
          scheduleId: mockSchedule.id,
          serviceId: mockSchedule.services[0].serviceId,
        },
      });
    });
  });
});
