import { apiClient } from "@/lib/api-client";
import { 
  AssessmentsResponse, 
  AssessmentResponse, 
  AssessmentListParams, 
  CreateAssessmentInput, 
  UpdateAssessmentInput, 
  CancelAssessmentInput 
} from "./types";

export const assessmentsApi = {
  getAssessments: (params: AssessmentListParams) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) query.append(key, value.toString());
    });
    return apiClient.get<AssessmentsResponse>(`/assessments?${query.toString()}`);
  },

  getAssessment: (id: string) => {
    return apiClient.get<AssessmentResponse>(`/assessments/${id}`);
  },

  createAssessment: (data: CreateAssessmentInput) => {
    return apiClient.post<AssessmentResponse>("/assessments", data);
  },

  updateAssessment: (id: string, data: UpdateAssessmentInput) => {
    return apiClient.patch<AssessmentResponse>(`/assessments/${id}`, data);
  },

  recalculateAssessment: (id: string) => {
    return apiClient.patch<AssessmentResponse>(`/assessments/${id}/recalculate`, {});
  },

  issueAssessment: (id: string) => {
    return apiClient.patch<AssessmentResponse>(`/assessments/${id}/issue`, {});
  },

  cancelAssessment: (id: string, data: CancelAssessmentInput) => {
    return apiClient.patch<AssessmentResponse>(`/assessments/${id}/cancel`, data);
  },

  getAssessmentByPropertyAndYear: (propertyId: string, taxYear: number) => {
    return apiClient.get<AssessmentResponse>(`/assessments/property/${propertyId}/year/${taxYear}`);
  },
};
