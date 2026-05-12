import { z } from "zod";
import { 
  createAssessmentSchema, 
  updateAssessmentSchema, 
  assessmentQuerySchema,
  cancelAssessmentSchema
} from "./assessments.validation";

export type CreateAssessmentDto = z.infer<typeof createAssessmentSchema>;
export type UpdateAssessmentDto = z.infer<typeof updateAssessmentSchema>;
export type AssessmentQueryDto = z.infer<typeof assessmentQuerySchema>;
export type CancelAssessmentDto = z.infer<typeof cancelAssessmentSchema>;
