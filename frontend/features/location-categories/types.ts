import { z } from "zod";
import { locationCategorySchema, locationCategoryQuerySchema } from "./schema";

export type LocationCategory = z.infer<typeof locationCategorySchema>;
export type LocationCategoryQuery = z.infer<typeof locationCategoryQuerySchema>;

export interface LocationCategoriesResponse {
  success: boolean;
  message: string;
  data: LocationCategory[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface LocationCategoryResponse {
  success: boolean;
  message: string;
  data: LocationCategory;
}
