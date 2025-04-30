import { prismaClient } from "../../lib/prismaClient";
import { UserService } from "../userService";

jest.mock("../../lib/prismaClient", () => ({
  prismaClient: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe("UserService", () => {
  const mockUser = {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    password: "hashedPassword123",
    taxId: "12345678909",
    cellPhone: "42999999999",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("findById", () => {
    it("should find a user by id successfully", async () => {
      (prismaClient.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await UserService.findById(mockUser.id);

      expect(prismaClient.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
      expect(result).toEqual(mockUser);
    });

    it("should return null when user is not found", async () => {
      (prismaClient.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await UserService.findById("non-existent-id");

      expect(result).toBeNull();
    });
  });

  describe("findByEmail", () => {
    it("should find a user by email successfully", async () => {
      (prismaClient.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await UserService.findByEmail(mockUser.email);

      expect(prismaClient.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockUser.email },
      });
      expect(result).toEqual(mockUser);
    });

    it("should return null when user is not found by email", async () => {
      (prismaClient.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await UserService.findByEmail("non-existent@example.com");

      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    it("should create a user successfully", async () => {
      (prismaClient.user.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await UserService.create(mockUser);

      expect(prismaClient.user.create).toHaveBeenCalledWith({
        data: mockUser,
      });
      expect(result).toEqual(mockUser);
    });

    it("should handle errors when creating a user", async () => {
      const error = new Error("Database error");
      (prismaClient.user.create as jest.Mock).mockRejectedValue(error);

      await expect(UserService.create(mockUser)).rejects.toThrow(
        "Database error"
      );
    });
  });

  describe("update", () => {
    it("should update a user successfully", async () => {
      const updateData = { name: "Updated Name" };
      const updatedUser = { ...mockUser, ...updateData };
      (prismaClient.user.update as jest.Mock).mockResolvedValue(updatedUser);

      const result = await UserService.update(mockUser.id, updateData);

      expect(prismaClient.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: updateData,
      });
      expect(result).toEqual(updatedUser);
    });

    it("should handle errors when updating a user", async () => {
      const error = new Error("Database error");
      (prismaClient.user.update as jest.Mock).mockRejectedValue(error);

      await expect(
        UserService.update(mockUser.id, { name: "Updated" })
      ).rejects.toThrow("Database error");
    });
  });
});
