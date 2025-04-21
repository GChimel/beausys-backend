import { prismaClient } from "../../lib/prismaClient";
import { ProductService } from "../productService";

jest.mock("../../lib/prismaClient", () => ({
  prismaClient: {
    product: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe("ProductService", () => {
  const mockProducts = [
    {
      id: "1",
      companyId: "1",
      name: "Product A",
      price: 10.3,
      description: "Product A description",
      photo: "photo.png",
      createdAt: "2025-01-02",
      updatedAt: "2025-01-02",
    },
    {
      id: "2",
      companyId: "2",
      name: "Product B",
      price: 10.3,
      description: "Product B description",
      photo: "photo.png",
      createdAt: "2025-01-02",
      updatedAt: "2025-01-02",
    },
    {
      id: "3",
      companyId: "1",
      name: "Product C",
      price: 10.3,
      description: "Product C description",
      photo: "photo.png",
      createdAt: "2025-01-02",
      updatedAt: "2025-01-02",
    },
  ];

  let products = [...mockProducts];

  beforeEach(() => {
    products = [...mockProducts];
  });

  it("Should create a product", async () => {
    (prismaClient.product.create as jest.Mock).mockResolvedValue(
      mockProducts[0]
    );

    const result = await ProductService.create(mockProducts[0] as any);

    expect(result).toEqual(mockProducts[0]);
    expect(prismaClient.product.create).toHaveBeenCalledWith({
      data: mockProducts[0],
    });
  });

  it("Should find a product by company & id", async () => {
    (prismaClient.product.findUnique as jest.Mock).mockImplementation(
      ({ where }) => {
        return products.find((p) => p.id === where.id);
      }
    );

    const result = await ProductService.findById("1");

    expect(prismaClient.product.findUnique).toHaveBeenCalledWith({
      where: { id: "1" },
    });
    expect(result).toEqual(mockProducts[0]);
  });

  it("Should find all products by companyId", async () => {
    (prismaClient.product.findMany as jest.Mock).mockImplementation(
      ({ where }) => {
        return products.filter((p) => p.companyId === where.companyId);
      }
    );
    const result = await ProductService.findAll("1");

    expect(prismaClient.product.findMany).toHaveBeenCalledWith({
      where: { companyId: "1" },
    });

    expect(result).toEqual([mockProducts[0], mockProducts[2]]);
  });

  it("Should be able to delete a product", async () => {
    (prismaClient.product.delete as jest.Mock).mockImplementation(
      ({ where }) => {
        const index = products.findIndex((p) => p.id === where.id);
        if (index !== -1) {
          const [deleted] = products.splice(index, 1);
          return deleted;
        }
        throw new Error("Product not found");
      }
    );

    (prismaClient.product.findMany as jest.Mock).mockImplementation(
      ({ where }) => {
        return products.filter((p) => p.companyId === where.companyId);
      }
    );

    await ProductService.delete("1");

    expect(prismaClient.product.delete).toHaveBeenCalledWith({
      where: { id: "1" },
    });

    const result = await ProductService.findAll("1");

    expect(result).toEqual([mockProducts[2]]);
  });

  it("Should be able to update a product", async () => {
    (prismaClient.product.update as jest.Mock).mockImplementation(
      ({ where, data }) => {
        const index = products.findIndex((p) => p.id === where.id);
        if (index === -1) throw new Error("Product not found");

        const updated = { ...products[index], ...data };
        products[index] = updated;
        return updated;
      }
    );

    const updatedData = {
      name: "Updated Product",
      price: 99.99,
    };

    const result = await ProductService.update("1", updatedData);

    expect(prismaClient.product.update).toHaveBeenCalledWith({
      where: { id: "1" },
      data: updatedData,
    });

    expect(result.name).toBe("Updated Product");
    expect(result.price).toBe(99.99);
  });
});
