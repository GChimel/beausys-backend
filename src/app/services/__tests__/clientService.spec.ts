import { prismaClient } from "../../lib/prismaClient";
import { ClientService } from "../clientService";

jest.mock("../../lib/prismaClient", () => ({
  prismaClient: {
    client: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  },
}));

describe("ClientService", () => {
  const mockClient = {
    id: "1",
    name: "John Doe",
    email: "lH0lT@example.com",
    companyId: "1",
  };

  const mockClients = [
    {
      id: "1",
      name: "Client A",
      email: "a@example.com",
      companyId: "company-1",
    },
    {
      id: "2",
      name: "Client B",
      email: "b@example.com",
      companyId: "company-2",
    },
    {
      id: "3",
      name: "Client C",
      email: "c@example.com",
      companyId: "company-1",
    },
  ];

  it("should create a client", async () => {
    (prismaClient.client.create as jest.Mock).mockResolvedValue(mockClient);

    const result = await ClientService.create(mockClient as any);
    expect(result).toEqual(mockClient);

    expect(prismaClient.client.create).toHaveBeenCalledWith({
      data: mockClient,
    });
  });

  it("should find client by id", async () => {
    (prismaClient.client.findUnique as jest.Mock).mockImplementation(
      ({ where }) => {
        if (where.id === mockClient.id) return mockClient;
        return null;
      }
    );

    const result = await ClientService.findById(mockClient.id);

    expect(prismaClient.client.findUnique).toHaveBeenCalledWith({
      where: { id: "1" },
    });

    expect(result).toEqual(mockClient);
  });

  it("should find all clients by companyId", async () => {
    (prismaClient.client.findMany as jest.Mock).mockImplementation(
      ({ where }) => {
        return mockClients.filter((c) => c.companyId === where.companyId);
      }
    );

    const result = await ClientService.findAll("company-1");

    expect(prismaClient.client.findMany).toHaveBeenCalledWith({
      where: { companyId: "company-1" },
    });

    expect(result).toEqual([
      {
        id: "1",
        name: "Client A",
        email: "a@example.com",
        companyId: "company-1",
      },
      {
        id: "3",
        name: "Client C",
        email: "c@example.com",
        companyId: "company-1",
      },
    ]);
  });

  it("should find client by email and companyId", async () => {
    (prismaClient.client.findFirst as jest.Mock).mockResolvedValue({
      id: "1",
      name: "Client A",
      email: "a@example.com",
      companyId: "company-1",
    });

    const result = await ClientService.findByEmail(
      "company-1",
      "a@example.com"
    );

    expect(prismaClient.client.findFirst).toHaveBeenCalledWith({
      where: {
        email: "a@example.com",
        companyId: "company-1",
      },
    });

    expect(result?.email).toEqual("a@example.com");
  });

  it("should find clients by name and companyId", async () => {
    (prismaClient.client.findMany as jest.Mock).mockImplementation(
      ({ where }) => {
        return mockClients.filter(
          (c) => c.companyId === where.companyId && c.name.includes("Client A")
        );
      }
    );

    const result = await ClientService.findByName("company-1", "Client A");
    expect(prismaClient.client.findMany).toHaveBeenCalledWith({
      where: {
        name: { contains: "Client A", mode: "insensitive" },
        companyId: "company-1",
      },
    });

    expect(result).toEqual([
      {
        id: "1",
        name: "Client A",
        email: "a@example.com",
        companyId: "company-1",
      },
    ]);
  });
});
