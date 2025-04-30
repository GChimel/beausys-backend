import { prismaClient } from "../../lib/prismaClient";
import { CompanyService } from "../companyService";

jest.mock("../../lib/prismaClient", () => ({
  prismaClient: {
    company: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe("CompanyService", () => {
  const mockCompany = {
    id: "1",
    name: "Test Company",
    email: "company@example.com",
    userId: "user-1",
    address: "123 Test Street",
    addressNumber: 123,
    zipCode: "12345",
    cellPhone: "1234567890",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("findById", () => {
    it("should find a company by id successfully", async () => {
      (prismaClient.company.findUnique as jest.Mock).mockResolvedValue(
        mockCompany
      );

      const result = await CompanyService.findById(mockCompany.id);

      expect(prismaClient.company.findUnique).toHaveBeenCalledWith({
        where: { id: mockCompany.id },
      });
      expect(result).toEqual(mockCompany);
    });

    it("should return null when company is not found", async () => {
      (prismaClient.company.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await CompanyService.findById("non-existent-id");

      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    it("should create a company successfully", async () => {
      (prismaClient.company.create as jest.Mock).mockResolvedValue(mockCompany);

      const result = await CompanyService.create(mockCompany);

      expect(prismaClient.company.create).toHaveBeenCalledWith({
        data: mockCompany,
      });
      expect(result).toEqual(mockCompany);
    });

    it("should handle errors when creating a company", async () => {
      const error = new Error("Database error");
      (prismaClient.company.create as jest.Mock).mockRejectedValue(error);

      await expect(CompanyService.create(mockCompany)).rejects.toThrow(
        "Database error"
      );
    });
  });

  describe("findByUserIdAndName", () => {
    it("should find a company by userId and name successfully", async () => {
      (prismaClient.company.findFirst as jest.Mock).mockResolvedValue(
        mockCompany
      );

      const result = await CompanyService.findByUserIdAndName(
        mockCompany.userId,
        mockCompany.name
      );

      expect(prismaClient.company.findFirst).toHaveBeenCalledWith({
        where: {
          userId: mockCompany.userId,
          name: {
            contains: mockCompany.name,
          },
        },
      });
      expect(result).toEqual(mockCompany);
    });

    it("should return null when company is not found", async () => {
      (prismaClient.company.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await CompanyService.findByUserIdAndName(
        "user-1",
        "Non Existent"
      );

      expect(result).toBeNull();
    });
  });

  describe("findAll", () => {
    it("should find all companies by userId successfully", async () => {
      const mockCompanies = [mockCompany];
      (prismaClient.company.findMany as jest.Mock).mockResolvedValue(
        mockCompanies
      );

      const result = await CompanyService.findAll(mockCompany.userId);

      expect(prismaClient.company.findMany).toHaveBeenCalledWith({
        where: { userId: mockCompany.userId },
      });
      expect(result).toEqual(mockCompanies);
    });

    it("should return empty array when no companies are found", async () => {
      (prismaClient.company.findMany as jest.Mock).mockResolvedValue([]);

      const result = await CompanyService.findAll("non-existent-user");

      expect(result).toEqual([]);
    });
  });

  describe("findByEmail", () => {
    it("should find a company by email successfully", async () => {
      (prismaClient.company.findUnique as jest.Mock).mockResolvedValue(
        mockCompany
      );

      const result = await CompanyService.findByEmail(mockCompany.email);

      expect(prismaClient.company.findUnique).toHaveBeenCalledWith({
        where: { email: mockCompany.email },
      });
      expect(result).toEqual(mockCompany);
    });

    it("should return null when company is not found by email", async () => {
      (prismaClient.company.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await CompanyService.findByEmail(
        "non-existent@example.com"
      );

      expect(result).toBeNull();
    });
  });

  describe("update", () => {
    it("should update a company successfully", async () => {
      const updateData = { name: "Updated Company" };
      const updatedCompany = { ...mockCompany, ...updateData };
      (prismaClient.company.update as jest.Mock).mockResolvedValue(
        updatedCompany
      );

      const result = await CompanyService.update(mockCompany.id, updateData);

      expect(prismaClient.company.update).toHaveBeenCalledWith({
        where: { id: mockCompany.id },
        data: updateData,
      });
      expect(result).toEqual(updatedCompany);
    });

    it("should handle errors when updating a company", async () => {
      const error = new Error("Database error");
      (prismaClient.company.update as jest.Mock).mockRejectedValue(error);

      await expect(
        CompanyService.update(mockCompany.id, { name: "Updated" })
      ).rejects.toThrow("Database error");
    });
  });

  describe("delete", () => {
    it("should delete a company successfully", async () => {
      (prismaClient.company.delete as jest.Mock).mockResolvedValue(mockCompany);

      const result = await CompanyService.delete(mockCompany.id);

      expect(prismaClient.company.delete).toHaveBeenCalledWith({
        where: { id: mockCompany.id },
      });
      expect(result).toEqual(mockCompany);
    });

    it("should handle errors when deleting a company", async () => {
      const error = new Error("Database error");
      (prismaClient.company.delete as jest.Mock).mockRejectedValue(error);

      await expect(CompanyService.delete(mockCompany.id)).rejects.toThrow(
        "Database error"
      );
    });
  });
});
