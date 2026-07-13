import axios from "axios";

import { CustomOpenAPIConfig } from "@/api/custom/OpenAPIConfig";

const api = axios.create({
  baseURL: `${CustomOpenAPIConfig.BASE}/api/v1/Products`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getProductByBarcode = async (barcode: string) => {
  const { data } = await api.get(`/barcode/${barcode.trim()}`);
  return data;
};

export const getAllProducts = async () => {
  const { data } = await api.get("");
  return data;
};

export const addProduct = async (product: any) => {
  const { data } = await api.post("", product);
  return data;
};
