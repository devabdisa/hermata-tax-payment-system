import { apiClient } from "@/lib/api-client";
import { ApiResponse } from "@/types/api";
import { User, UserFormData } from "./types";

export const usersApi = {
  getUsers: (params: any = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query.append(key, String(value));
      }
    });
    const queryString = query.toString();
    return apiClient.get<ApiResponse<User[]>>(`/users${queryString ? `?${queryString}` : ""}`);
  },
  
  getUser: (id: string) => 
    apiClient.get<ApiResponse<User>>(`/users/${id}`),
  
  getMe: () => 
    apiClient.get<ApiResponse<User>>("/users/me"),
  
  createUser: (data: UserFormData) => 
    apiClient.post<ApiResponse<User>>("/users", data),
  
  updateUser: (id: string, data: Partial<UserFormData>) => 
    apiClient.patch<ApiResponse<User>>(`/users/${id}`, data),
  
  deleteUser: (id: string) => 
    apiClient.delete<ApiResponse<null>>(`/users/${id}`),
};
