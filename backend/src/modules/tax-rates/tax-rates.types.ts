import { z } from "zod";
import { 
  createTaxRateSchema, 
  updateTaxRateSchema, 
  taxRateQuerySchema 
} from "./tax-rates.validation";

export type CreateTaxRateDto = z.infer<typeof createTaxRateSchema>;
export type UpdateTaxRateDto = z.infer<typeof updateTaxRateSchema>;
export type TaxRateQueryDto = z.infer<typeof taxRateQuerySchema>;
