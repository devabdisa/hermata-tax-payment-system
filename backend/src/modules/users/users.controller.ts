import { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async";
import { ApiResponse } from "../../utils/api-response";
import { UsersService } from "./users.service";
import { UserRole, UserStatus } from "@prisma/client";
import { ApiError } from "../../utils/api-error";

export const listUsers = catchAsync(async (req: Request, res: Response) => {
  const { role, status, search } = req.query;
  const users = await UsersService.listUsers({
    role: role as UserRole,
    status: status as UserStatus,
    search: search as string,
  });
  res.status(200).json(new ApiResponse(200, users, "Users retrieved successfully"));
});

export const getUser = catchAsync(async (req: Request, res: Response) => {
  const user = await UsersService.getUserById(req.params.id as string);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  res.status(200).json(new ApiResponse(200, user, "User retrieved successfully"));
});

export const getMe = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Authentication required");
  }

  const user = await UsersService.getUserById(req.user.id);
  
  if (!user) {
    throw new ApiError(404, "User account not found");
  }

  // Enrich user with current session permissions
  const userWithPermissions = {
    ...user,
    permissions: req.user.permissions,
  };

  res.status(200).json(new ApiResponse(200, userWithPermissions, "Current user profile retrieved"));
});

export const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await UsersService.createUser(req.body);
  res.status(201).json(new ApiResponse(201, user, "User created successfully"));
});

export const updateUser = catchAsync(async (req: Request, res: Response) => {
  const user = await UsersService.updateUser(req.params.id as string, req.body);
  res.status(200).json(new ApiResponse(200, user, "User updated successfully"));
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  await UsersService.deleteUser(req.params.id as string);
  res.status(200).json(new ApiResponse(200, null, "User deleted successfully"));
});
