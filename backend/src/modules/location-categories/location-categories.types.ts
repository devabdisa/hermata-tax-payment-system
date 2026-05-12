import { z } from "zod";
import { 
  createLocationCategorySchema, 
  updateLocationCategorySchema, 
  locationCategoryQuerySchema 
} from "./location-categories.validation";

export type CreateLocationCategoryDto = z.infer<typeof createLocationCategorySchema>;
export type UpdateLocationCategoryDto = z.infer<typeof updateLocationCategorySchema>;
export type LocationCategoryQueryDto = z.infer<typeof locationCategoryQuerySchema>;
