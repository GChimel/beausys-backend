// https://api.abacatepay.com/v1

import axios from "axios";
import { ENV_VARS } from "../config/env";

interface User {
  name: string;
  email: string;
  cellPhone: string;
  taxId: string;
}

const acabateApi = axios.create({
  baseURL: "https://api.abacatepay.com/v1",
  headers: {
    Authorization: `Bearer ${ENV_VARS.ABC_SECRET}`,
    "Content-Type": "application/json",
  },
});

export class AbcPay {
  static async createUser(user: User) {
    const { data } = await acabateApi.post("/customer/create", user);

    return data;
  }

  static async listUsers() {
    const { data } = await acabateApi.get("/customers/list");

    return data;
  }
}
