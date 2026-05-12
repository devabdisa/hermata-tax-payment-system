import { z } from "zod";
import { taxRateSchema, taxRateQuerySchema } from "./schema";
import { LocationCategory } from "../location-categories/types";

export type TaxRate = z.infer<typeof taxRateSchema> & {
  locationCategory?: LocationCategory;
};

export type TaxRateQuery = z.infer<typeof taxRateQuerySchema>;

export interface TaxRatesResponse {
  success: boolean;
  message: string;
  data: TaxRate[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface TaxRateResponse {
  success: boolean;
  message: string;
  data: TaxRate;
}
