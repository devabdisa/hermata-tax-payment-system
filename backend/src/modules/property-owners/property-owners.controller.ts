import { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async";
import { ApiResponse } from "../../utils/api-response";
import { PropertyOwnersService } from "./property-owners.service";

export const listOwners = catchAsync(async (req: Request, res: Response) => {
  const { search } = req.query;
  const owners = await PropertyOwnersService.listOwners({
    search: search as string,
  });
  res.status(200).json(new ApiResponse(200, owners, "Owners retrieved successfully"));
});

export const getOwner = catchAsync(async (req: Request, res: Response) => {
  const owner = await PropertyOwnersService.getOwnerById(req.params.id as string);
  if (!owner) {
    return res.status(404).json(new ApiResponse(404, null, "Owner not found"));
  }
  res.status(200).json(new ApiResponse(200, owner, "Owner retrieved successfully"));
});

export const createOwner = catchAsync(async (req: Request, res: Response) => {
  const owner = await PropertyOwnersService.createOwner(req.body);
  res.status(201).json(new ApiResponse(201, owner, "Owner profile created successfully"));
});

export const updateOwner = catchAsync(async (req: Request, res: Response) => {
  const owner = await PropertyOwnersService.updateOwner(req.params.id as string, req.body);
  res.status(200).json(new ApiResponse(200, owner, "Owner profile updated successfully"));
});

export const deleteOwner = catchAsync(async (req: Request, res: Response) => {
  try {
    await PropertyOwnersService.deleteOwner(req.params.id as string);
    res.status(200).json(new ApiResponse(200, null, "Owner profile deleted successfully"));
  } catch (error: any) {
    res.status(400).json(new ApiResponse(400, null, error.message));
  }
});
