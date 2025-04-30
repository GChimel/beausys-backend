import axios from "axios";
import { AbacatePayService } from "../abacatePayService";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock the module
jest.mock("../abacatePayService", () => {
  const mockAbacateApi = {
    post: jest.fn(),
    get: jest.fn(),
  };

  return {
    AbacatePayService: {
      createUser: jest.fn().mockImplementation(async (user) => {
        const response = await mockAbacateApi.post("/customer/create", user);
        return response.data;
      }),
      listUsers: jest.fn().mockImplementation(async () => {
        const response = await mockAbacateApi.get("/customers/list");
        return response.data;
      }),
      createBilling: jest.fn().mockImplementation(async (billing) => {
        const response = await mockAbacateApi.post("/billing/create", billing);
        return response.data;
      }),
      listBillings: jest.fn().mockImplementation(async () => {
        const response = await mockAbacateApi.get("/billings/list");
        return response.data;
      }),
      checkBillingStatus: jest.fn().mockImplementation(async (billingId) => {
        const response = await mockAbacateApi.get(
          `/billing/${billingId}/status`
        );
        return response.data;
      }),
    },
    abacateApi: mockAbacateApi,
  };
});

describe("AbacatePayService", () => {
  const mockUser = {
    name: "John Doe",
    email: "john@example.com",
    cellphone: "42999999999",
    taxId: "12345678909",
  };

  const mockProduct = {
    externalId: "123",
    name: "Test Product",
    description: "Test Description",
    quantity: 1,
    price: 99.99,
  };

  const mockBilling = {
    frequency: "ONE_TIME" as const,
    methods: ["PIX"] as ["PIX"],
    products: [mockProduct],
    returnUrl: "https://example.com/return",
    completionUrl: "https://example.com/completion",
    customer: mockUser,
  };

  const { abacateApi } = jest.requireMock("../abacatePayService");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createUser", () => {
    it("should create a user successfully", async () => {
      const mockResponse = { data: { id: "123", ...mockUser } };
      abacateApi.post.mockResolvedValue(mockResponse);

      const result = await AbacatePayService.createUser(mockUser);

      expect(abacateApi.post).toHaveBeenCalledWith(
        "/customer/create",
        mockUser
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should handle errors when creating a user", async () => {
      const mockError = new Error("API Error");
      abacateApi.post.mockRejectedValue(mockError);

      await expect(AbacatePayService.createUser(mockUser)).rejects.toThrow(
        "API Error"
      );
    });
  });

  describe("listUsers", () => {
    it("should list users successfully", async () => {
      const mockResponse = { data: [{ id: "123", ...mockUser }] };
      abacateApi.get.mockResolvedValue(mockResponse);

      const result = await AbacatePayService.listUsers();

      expect(abacateApi.get).toHaveBeenCalledWith("/customers/list");
      expect(result).toEqual(mockResponse.data);
    });

    it("should handle errors when listing users", async () => {
      const mockError = new Error("API Error");
      abacateApi.get.mockRejectedValue(mockError);

      await expect(AbacatePayService.listUsers()).rejects.toThrow("API Error");
    });
  });

  describe("createBilling", () => {
    it("should create a billing successfully", async () => {
      const mockResponse = { data: { id: "123", ...mockBilling } };
      abacateApi.post.mockResolvedValue(mockResponse);

      const result = await AbacatePayService.createBilling(mockBilling);

      expect(abacateApi.post).toHaveBeenCalledWith(
        "/billing/create",
        mockBilling
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should handle errors when creating a billing", async () => {
      const mockError = new Error("API Error");
      abacateApi.post.mockRejectedValue(mockError);

      await expect(
        AbacatePayService.createBilling(mockBilling)
      ).rejects.toThrow("API Error");
    });
  });

  describe("listBillings", () => {
    it("should list billings successfully", async () => {
      const mockResponse = { data: [{ id: "123", ...mockBilling }] };
      abacateApi.get.mockResolvedValue(mockResponse);

      const result = await AbacatePayService.listBillings();

      expect(abacateApi.get).toHaveBeenCalledWith("/billings/list");
      expect(result).toEqual(mockResponse.data);
    });

    it("should handle errors when listing billings", async () => {
      const mockError = new Error("API Error");
      abacateApi.get.mockRejectedValue(mockError);

      await expect(AbacatePayService.listBillings()).rejects.toThrow(
        "API Error"
      );
    });
  });

  describe("checkBillingStatus", () => {
    it("should check billing status successfully", async () => {
      const billingId = "123";
      const mockResponse = { data: { status: "PAID" } };
      abacateApi.get.mockResolvedValue(mockResponse);

      const result = await AbacatePayService.checkBillingStatus(billingId);

      expect(abacateApi.get).toHaveBeenCalledWith(
        `/billing/${billingId}/status`
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should handle errors when checking billing status", async () => {
      const billingId = "123";
      const mockError = new Error("API Error");
      abacateApi.get.mockRejectedValue(mockError);

      await expect(
        AbacatePayService.checkBillingStatus(billingId)
      ).rejects.toThrow("API Error");
    });
  });
});
