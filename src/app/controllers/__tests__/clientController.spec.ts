import { FastifyReply, FastifyRequest } from "fastify";
import { ClientService } from "../../services/clientService";
import { CompanyService } from "../../services/companyService";
import { RefreshTokenService } from "../../services/refreshTokenService";
import { ClientController } from "../clientController";

jest.mock("../../services/clientService");
jest.mock("../../services/companyService");
jest.mock("../../services/refreshTokenService");

const mockReply = () => {
  const reply: Partial<FastifyReply> = {
    code: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    jwtSign: jest.fn().mockResolvedValue("mockAccessToken"),
  };
  return reply as FastifyReply;
};

describe("ClientController", () => {
  describe("register", () => {
    it("should register a new client and return tokens", async () => {
      const request = {
        body: {
          companyId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          name: "Test User",
          email: "test@example.com",
          password: "password123",
          cellPhone: "11999999999",
        },
      } as FastifyRequest;

      const reply = mockReply();

      (CompanyService.findById as jest.Mock).mockResolvedValue({
        id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      });
      (ClientService.findByEmail as jest.Mock).mockResolvedValue(null);
      (ClientService.create as jest.Mock).mockResolvedValue({ id: "client-1" });
      (RefreshTokenService.create as jest.Mock).mockResolvedValue({
        id: "refresh-token",
      });

      await ClientController.register(request, reply);

      expect(CompanyService.findById).toHaveBeenCalledWith(
        "3fa85f64-5717-4562-b3fc-2c963f66afa6"
      );
      expect(ClientService.findByEmail).toHaveBeenCalledWith(
        "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "test@example.com"
      );
      expect(ClientService.create).toHaveBeenCalled();
      expect(reply.jwtSign).toHaveBeenCalledWith({ sub: "client-1" });
      expect(reply.code).toHaveBeenCalledWith(201);
      expect(reply.send).toHaveBeenCalledWith({
        accessToken: "mockAccessToken",
        refreshToken: "refresh-token",
      });
    });
  });

  describe("findAll", () => {
    it("should return all clients for a company", async () => {
      const request = {
        query: { companyId: "3fa85f64-5717-4562-b3fc-2c963f66afa6" },
      } as unknown as FastifyRequest;

      const reply = mockReply();
      const mockClients = [{ id: "1" }, { id: "2" }];

      (ClientService.findAll as jest.Mock).mockResolvedValue(mockClients);

      await ClientController.findAll(request, reply);

      expect(ClientService.findAll).toHaveBeenCalledWith(
        "3fa85f64-5717-4562-b3fc-2c963f66afa6"
      );
      expect(reply.status).toHaveBeenCalledWith(200);
      expect(reply.send).toHaveBeenCalledWith(mockClients);
    });
  });

  describe("findByName", () => {
    it("should return matching clients by name for a company", async () => {
      const request = {
        query: { companyId: "3fa85f64-5717-4562-b3fc-2c963f66afa6" },
        params: { clientName: "John" },
      } as unknown as FastifyRequest;

      const reply = mockReply();
      const mockClients = [{ id: "1", name: "John" }];

      (ClientService.findByName as jest.Mock).mockResolvedValue(mockClients);

      await ClientController.findByName(request, reply);

      expect(ClientService.findByName).toHaveBeenCalledWith(
        "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "John"
      );
      expect(reply.status).toHaveBeenCalledWith(200);
      expect(reply.send).toHaveBeenCalledWith(mockClients);
    });
  });
});
