import { apiClient } from "@/lib/api-client";
import { 
  DashboardReport, 
  CollectionSummary, 
  UnpaidReport, 
  PendingWorkReport, 
  PropertiesDistribution, 
  AssessmentsDistribution, 
  PaymentsDistribution,
  ReportFilters
} from "./types";

const buildQueryString = (params: any) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, String(value));
    }
  });
  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
};

export const reportsApi = {
  getDashboard: () => 
    apiClient.get<{ data: DashboardReport }>("/reports/dashboard"),
  
  getCollections: (params?: ReportFilters) => 
    apiClient.get<{ data: CollectionSummary }>(`/reports/collections${buildQueryString(params || {})}`),
  
  getUnpaid: (params?: any) => 
    apiClient.get<{ data: UnpaidReport }>(`/reports/unpaid${buildQueryString(params || {})}`),
  
  getPendingWork: () => 
    apiClient.get<{ data: PendingWorkReport }>("/reports/pending-work"),
  
  getProperties: (params?: any) => 
    apiClient.get<{ data: PropertiesDistribution }>(`/reports/properties${buildQueryString(params || {})}`),
  
  getAssessments: (params?: any) => 
    apiClient.get<{ data: AssessmentsDistribution }>(`/reports/assessments${buildQueryString(params || {})}`),
  
  getPayments: (params?: any) => 
    apiClient.get<{ data: PaymentsDistribution }>(`/reports/payments${buildQueryString(params || {})}`),
};
