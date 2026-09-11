import { httpClient } from "./httpClient";
import { TaxRate } from "../types";

export const getCurrentTaxRate = () =>
  httpClient.get<TaxRate>("/tax").then((res) => res.data);

export const createTaxRate = (data: { cgst: number; sgst: number }) =>
  httpClient.post<TaxRate>("/tax", data).then((res) => res.data);
