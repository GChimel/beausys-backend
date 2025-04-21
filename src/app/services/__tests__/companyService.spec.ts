import { prismaClient } from "../../lib/prismaClient";
import { CompanyService } from "../companyService";

jest.mock("../../lib/prismaClient", () => ({
  prismaClient: {
    company: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  },
}));

describe("CompanyService", () => {
  const mockCompanys = [
    {
      id: "1",
      userId: "a8c425a6-ffe6-41c7-81ea-c77800a99eab",
      name: "company A",
      color: "#384243",
      email: "teste@teste.com",
      address: "example street",
      addressNumber: 90,
      zipCode: 84500000,
      cellPhone: 11999999999,
    },
    {
      id: "2",
      userId: "e5c425a6-ffe6-41c7-81ea-c77800a99eab",
      name: "company B",
      color: "#384243",
      email: "teste@teste.com",
      address: "example street",
      addressNumber: 90,
      zipCode: 84500000,
      cellPhone: 11999999999,
    },
  ];

  let companys = [...mockCompanys];

  beforeEach(() => {
    companys = [...mockCompanys];
  });

  it("Should create a company", async () => {
    (prismaClient.company.create as jest.Mock).mockResolvedValue(
      mockCompanys[0]
    );
    const result = await CompanyService.create(mockCompanys[0] as any);

    expect(result).toEqual(mockCompanys[0]);
    expect(prismaClient.company.create).toHaveBeenCalledWith({
      data: mockCompanys[0],
    });
  });

  it("Should find a company by id", async () => {
    (prismaClient.company.findUnique as jest.Mock).mockImplementation(
      ({ where }) => {
        return companys.find((c) => c.id === where.id);
      }
    );

    const result = await CompanyService.findById("1");

    expect(prismaClient.company.findUnique).toHaveBeenCalledWith({
      where: { id: "1" },
    });
    expect(result).toEqual(mockCompanys[0]);
  });
});
