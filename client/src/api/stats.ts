import { httpClient } from "./httpClient";
import { StatsResponse } from "../types";

export const getStats = (from: string, to: string) =>
  httpClient
    .get<StatsResponse>("/stats", { params: { from, to } })
    .then((res) => res.data);
