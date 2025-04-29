// https://api.abacatepay.com/v1

import axios from "axios";
import { ENV_VARS } from "../config/env";

interface User {
  name: string;
  email: string;
  cellphone: string;
  taxId: string;
}

interface Product {
  externalId: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
}

interface Billing {
  frequency: "ONE_TIME" | "MULTIPLE_PAYMENTS";
  methods: ["PIX"];
  products: Product[];
  returnUrl: string;
  completionUrl: string;
  customerId?: string;
  customer?: User;
}

const abacateApi = axios.create({
  baseURL: "https://api.abacatepay.com/v1",
  headers: {
    Authorization: `Bearer ${ENV_VARS.ABC_SECRET}`,
    "Content-Type": "application/json",
  },
});

export class AbacatePayService {
  static async createUser(user: User) {
    const { data } = await abacateApi.post("/customer/create", user);
    return data;
  }

  static async listUsers() {
    const { data } = await abacateApi.get("/customers/list");
    return data;
  }

  static async createBilling(billing: Billing) {
    const { data } = await abacateApi.post("/billing/create", billing);
    return data;
  }

  static async listBillings() {
    const { data } = await abacateApi.get("/billings/list");
    return data;
  }

  static async checkBillingStatus(billingId: string) {
    const { data } = await abacateApi.get(`/billing/${billingId}/status`);
    return data;
  }
}
