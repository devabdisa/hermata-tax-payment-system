import { z } from "zod";
import { 
  createPropertySchema, 
  updatePropertySchema, 
  propertyQuerySchema,
  rejectPropertySchema
} from "./properties.validation";

export type CreatePropertyDto = z.infer<typeof createPropertySchema>;
export type UpdatePropertyDto = z.infer<typeof updatePropertySchema>;
export type PropertyQueryDto = z.infer<typeof propertyQuerySchema>;
export type RejectPropertyDto = z.infer<typeof rejectPropertySchema>;
