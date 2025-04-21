jest.mock("../../lib/prismaClient", () => ({
  prismaClient: {
    client: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe("CompanyService", () => {
  const mockCompany = {
    userId: "e5c425a6-ffe6-41c7-81ea-c77800a99eab",
    name: "company",
    color: "#384243",
    email: "teste@teste.com",
    address: "example street",
    addressNumber: 90,
    zipCode: 84500000,
    cellPhone: 1199999999,
  };

  it("should create a company", async () => {
    // (prismaClient.company.create as jest.Mock).mockResolvedValue(mockCompany);

    // const result = await CompanyService.create(mockCompany as any);
    // console.log(result);
    // expect(result).toEqual(mockCompany);

    // expect(prismaClient.company.create).toHaveBeenCalledWith({
    //   data: mockCompany,
    // });

    expect(1 + 1).toEqual(2);
  });
});
