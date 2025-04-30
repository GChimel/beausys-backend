import { prismaClient } from "../../lib/prismaClient";
import { ClientService } from "../clientService";

jest.mock("../../lib/prismaClient", () => ({
  prismaClient: {
    client: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

describe("ClientService", () => {
  const mockClient = {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    cellPhone: "42999999999",
    companyId: "company-1",
    password: "hashedPassword123",
    registeredAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a client successfully", async () => {
      (prismaClient.client.create as jest.Mock).mockResolvedValue(mockClient);

      const result = await ClientService.create(mockClient);

      expect(prismaClient.client.create).toHaveBeenCalledWith({
        data: mockClient,
      });
      expect(result).toEqual(mockClient);
    });

    it("should handle errors when creating a client", async () => {
      const error = new Error("Database error");
      (prismaClient.client.create as jest.Mock).mockRejectedValue(error);

      await expect(ClientService.create(mockClient)).rejects.toThrow(
        "Database error"
      );
    });
  });

  describe("findById", () => {
    it("should find a client by id successfully", async () => {
      (prismaClient.client.findUnique as jest.Mock).mockResolvedValue(
        mockClient
      );

      const result = await ClientService.findById(mockClient.id);

      expect(prismaClient.client.findUnique).toHaveBeenCalledWith({
        where: { id: mockClient.id },
      });
      expect(result).toEqual(mockClient);
    });

    it("should return null when client is not found", async () => {
      (prismaClient.client.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await ClientService.findById("non-existent-id");

      expect(result).toBeNull();
    });
  });

  describe("findAll", () => {
    it("should find all clients by companyId successfully", async () => {
      const mockClients = [mockClient];
      (prismaClient.client.findMany as jest.Mock).mockResolvedValue(
        mockClients
      );

      const result = await ClientService.findAll(mockClient.companyId);

      expect(prismaClient.client.findMany).toHaveBeenCalledWith({
        where: { companyId: mockClient.companyId },
      });
      expect(result).toEqual(mockClients);
    });

    it("should return empty array when no clients are found", async () => {
      (prismaClient.client.findMany as jest.Mock).mockResolvedValue([]);

      const result = await ClientService.findAll("non-existent-company");

      expect(result).toEqual([]);
    });
  });

  describe("findByEmail", () => {
    it("should find a client by email successfully", async () => {
      (prismaClient.client.findUnique as jest.Mock).mockResolvedValue(
        mockClient
      );

      const result = await ClientService.findByEmail(mockClient.email);

      expect(prismaClient.client.findUnique).toHaveBeenCalledWith({
        where: { email: mockClient.email },
      });
      expect(result).toEqual(mockClient);
    });

    it("should return null when client is not found by email", async () => {
      (prismaClient.client.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await ClientService.findByEmail(
        "non-existent@example.com"
      );

      expect(result).toBeNull();
    });
  });

  describe("findByName", () => {
    it("should find clients by name and companyId successfully", async () => {
      const mockClients = [mockClient];
      (prismaClient.client.findMany as jest.Mock).mockResolvedValue(
        mockClients
      );

      const result = await ClientService.findByName(
        mockClient.companyId,
        "John"
      );

      expect(prismaClient.client.findMany).toHaveBeenCalledWith({
        where: {
          name: { contains: "John", mode: "insensitive" },
          companyId: mockClient.companyId,
        },
      });
      expect(result).toEqual(mockClients);
    });

    it("should return empty array when no clients are found by name", async () => {
      (prismaClient.client.findMany as jest.Mock).mockResolvedValue([]);

      const result = await ClientService.findByName(
        mockClient.companyId,
        "NonExistent"
      );

      expect(result).toEqual([]);
    });
  });
});
