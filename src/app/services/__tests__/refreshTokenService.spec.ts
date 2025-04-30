import { prismaClient } from "../../lib/prismaClient";
import { RefreshTokenService } from "../refreshTokenService";

jest.mock("../../lib/prismaClient", () => ({
  prismaClient: {
    refreshToken: {
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe("RefreshTokenService", () => {
  const mockRefreshToken = {
    id: "1",
    token: "mock-token",
    userId: "user-1",
    issuedAt: new Date("2025-01-01T00:00:00Z"),
    expiresAt: new Date("2025-01-01T00:00:00Z"),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("findById", () => {
    it("should find a refresh token by id successfully", async () => {
      (prismaClient.refreshToken.findUnique as jest.Mock).mockResolvedValue(
        mockRefreshToken
      );

      const result = await RefreshTokenService.findById(mockRefreshToken.id);

      expect(prismaClient.refreshToken.findUnique).toHaveBeenCalledWith({
        where: { id: mockRefreshToken.id },
      });

      expect(result).toEqual(mockRefreshToken);
    });
  });

  describe("create", () => {
    it("should create a refresh token successfully", async () => {
      (prismaClient.refreshToken.create as jest.Mock).mockResolvedValue(
        mockRefreshToken
      );

      const result = await RefreshTokenService.create(mockRefreshToken);

      expect(prismaClient.refreshToken.create).toHaveBeenCalledWith({
        data: mockRefreshToken,
      });

      expect(result).toEqual(mockRefreshToken);
    });
  });

  describe("delete", () => {
    it("should delete a refresh token successfully", async () => {
      (prismaClient.refreshToken.delete as jest.Mock).mockResolvedValue(
        mockRefreshToken
      );

      const result = await RefreshTokenService.delete(mockRefreshToken.id);

      expect(prismaClient.refreshToken.delete).toHaveBeenCalledWith({
        where: { id: mockRefreshToken.id },
      });

      expect(result).toEqual(mockRefreshToken);
    });
  });
});
