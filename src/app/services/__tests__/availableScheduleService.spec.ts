import { prismaClient } from "../../lib/prismaClient";
import { AvailableScheduleService } from "../availableScheduleService";

jest.mock("../../lib/prismaClient", () => ({
  prismaClient: {
    availableSchedule: {
      findMany: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe("AvailableScheduleService", () => {
  const mockAvailableSchedule = {
    id: "1",
    companyId: "company-1",
    date: new Date("2025-01-01T00:00:00Z"),
    startTime: new Date("2025-01-01T00:00:00Z"),
    endTime: new Date("2025-01-01T00:00:00Z"),
    intervalInMinutes: 30,
    days: [0, 1, 2, 3, 4],
    periodStart: new Date("2025-01-01T00:00:00Z"),
    periodEnd: new Date("2025-01-01T00:00:00Z"),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("findAll", () => {
    it("should find all available schedules successfully", async () => {
      (prismaClient.availableSchedule.findMany as jest.Mock).mockResolvedValue([
        mockAvailableSchedule,
      ]);

      const result = await AvailableScheduleService.findAll(
        mockAvailableSchedule.companyId,
        mockAvailableSchedule.periodStart,
        mockAvailableSchedule.periodEnd
      );

      expect(prismaClient.availableSchedule.findMany).toHaveBeenCalledWith({
        where: {
          companyId: mockAvailableSchedule.companyId,
          AND: [
            { startTime: { gte: mockAvailableSchedule.periodStart } },
            { endTime: { lte: mockAvailableSchedule.periodEnd } },
          ],
        },
      });

      expect(result).toEqual([mockAvailableSchedule]);
    });
  });

  describe("create", () => {
    it("should create a new available schedule successfully", async () => {
      (prismaClient.availableSchedule.create as jest.Mock).mockResolvedValue(
        mockAvailableSchedule
      );

      const result = await AvailableScheduleService.create(
        mockAvailableSchedule
      );

      expect(prismaClient.availableSchedule.create).toHaveBeenCalledWith({
        data: mockAvailableSchedule,
      });

      expect(result).toEqual(mockAvailableSchedule);
    });
  });

  describe("findById", () => {
    it("should find an available schedule by id successfully", async () => {
      (
        prismaClient.availableSchedule.findUnique as jest.Mock
      ).mockResolvedValue(mockAvailableSchedule);

      const result = await AvailableScheduleService.findById(
        mockAvailableSchedule.id
      );

      expect(prismaClient.availableSchedule.findUnique).toHaveBeenCalledWith({
        where: { id: mockAvailableSchedule.id },
      });

      expect(result).toEqual(mockAvailableSchedule);
    });

    it("should return null when schedule is not found", async () => {
      (
        prismaClient.availableSchedule.findUnique as jest.Mock
      ).mockResolvedValue(null);

      const result = await AvailableScheduleService.findById("non-existent-id");

      expect(result).toBeNull();
    });
  });

  describe("update", () => {
    it("should update an available schedule successfully", async () => {
      (prismaClient.availableSchedule.update as jest.Mock).mockResolvedValue(
        mockAvailableSchedule
      );

      const result = await AvailableScheduleService.udpate(
        mockAvailableSchedule.id,
        mockAvailableSchedule
      );

      expect(prismaClient.availableSchedule.update).toHaveBeenCalledWith({
        where: { id: mockAvailableSchedule.id },
        data: mockAvailableSchedule,
      });

      expect(result).toEqual(mockAvailableSchedule);
    });
  });
});
