import { httpClient } from "./httpClient";
import { Bill, CreateBillInput } from "../types";

export const createBill = (data: CreateBillInput) =>
  httpClient.post<Bill>("/bills", data).then((res) => res.data);
