import { prismaClient } from "../../lib/prismaClient";
import { ServiceService } from "../serviceService";

jest.mock("../../lib/prismaClient", () => ({
  prismaClient: {
    service: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe("ServicceService", () => {
  const mockServices = [
    {
      id: "1",
      companyId: "company-1",
      name: "Service A",
      description: "Service description A",
      expectedMinutes: 10,
      price: 10.1,
      photo: "photo.png",
      createdAt: "2025-01-02",
      updatedAt: "2025-01-02",
      company: {
        userId: "user-1",
      },
    },
    {
      id: "2",
      companyId: "company-1",
      name: "Service B",
      description: "Service description B",
      expectedMinutes: 10,
      price: 10.1,
      photo: "photo.png",
      createdAt: "2025-01-02",
      updatedAt: "2025-01-02",
      company: {
        userId: "user-1",
      },
    },
    {
      id: "3",
      companyId: "company-2",
      name: "Service C",
      description: "Service description C",
      expectedMinutes: 10,
      price: 10.1,
      photo: "photo.png",
      createdAt: "2025-01-02",
      updatedAt: "2025-01-02",
      company: {
        userId: "user-2",
      },
    },
  ];

  let services = [...mockServices];

  beforeEach(() => {
    services = [...mockServices];
  });

  it("Should create a service", async () => {
    (prismaClient.service.create as jest.Mock).mockResolvedValue(
      mockServices[0]
    );

    const result = await ServiceService.create(mockServices[0] as any);

    expect(result).toEqual(mockServices[0]);
    expect(prismaClient.service.create).toHaveBeenCalledWith({
      data: mockServices[0],
    });
  });

  it("Should find a service by id", async () => {
    (prismaClient.service.findUnique as jest.Mock).mockImplementation(
      ({ where }) => {
        return services.find((p) => p.id === where.id);
      }
    );

    const result = await ServiceService.findById("1");

    expect(result).toEqual(mockServices[0]);
  });

  it("Should find all services by companyId", async () => {
    (prismaClient.service.findMany as jest.Mock).mockImplementation(
      ({ where }) => {
        return services.filter((p) => p.companyId === where.companyId);
      }
    );
    const result = await ServiceService.findAll("company-1");

    expect(prismaClient.service.findMany).toHaveBeenCalledWith({
      where: { companyId: "company-1" },
    });

    expect(result).toEqual([mockServices[0], mockServices[1]]);
  });

  it("Should be able to delete a service", async () => {
    (prismaClient.service.delete as jest.Mock).mockImplementation(
      ({ where }) => {
        const index = services.findIndex((p) => p.id === where.id);
        if (index !== -1) {
          const [deleted] = services.splice(index, 1);
          return deleted;
        }
        throw new Error("Service not found");
      }
    );

    (prismaClient.service.findMany as jest.Mock).mockImplementation(
      ({ where }) => {
        return services.filter((p) => p.companyId === where.companyId);
      }
    );

    await ServiceService.delete("1");

    expect(prismaClient.service.delete).toHaveBeenCalledWith({
      where: { id: "1" },
    });

    const result = await ServiceService.findAll("company-1");

    expect(result).toEqual([mockServices[1]]);
  });

  it("Should be able to update a service", async () => {
    (prismaClient.service.update as jest.Mock).mockImplementation(
      ({ where, data }) => {
        const index = services.findIndex((p) => p.id === where.id);
        if (index === -1) throw new Error("Service not found");

        const updated = { ...services[index], ...data };
        services[index] = updated;
        return updated;
      }
    );

    const updatedData = {
      name: "Updated Service",
      description: "new description",
    };

    const result = await ServiceService.update("1", updatedData);

    expect(prismaClient.service.update).toHaveBeenCalledWith({
      where: { id: "1" },
      data: updatedData,
    });

    expect(result.name).toBe("Updated Service");
    expect(result.description).toBe("new description");
  });
});
