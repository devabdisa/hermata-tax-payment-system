import { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async";
import { ApiResponse } from "../../utils/api-response";
import { taxRatesService } from "./tax-rates.service";

export const getMany = catchAsync(async (req: Request, res: Response) => {
  const result = await taxRatesService.findAll(req.query);
  res.status(200).json(new ApiResponse(200, result.data, "Tax rates retrieved successfully", result.meta));
});

export const getOne = catchAsync(async (req: Request, res: Response) => {
  const taxRate = await taxRatesService.findById(req.params.id as string);
  res.status(200).json(new ApiResponse(200, taxRate, "Tax rate retrieved successfully"));
});

export const create = catchAsync(async (req: Request, res: Response) => {
  // Use req.user?.id. If not present (e.g., bypass issues), default to a safe value or throw error.
  const userId = req.user?.id;
  if (!userId) {
    throw new Error("User ID is required to create a tax rate");
  }

  const taxRate = await taxRatesService.create(req.body, userId);
  res.status(201).json(new ApiResponse(201, taxRate, "Tax rate created successfully"));
});

export const update = catchAsync(async (req: Request, res: Response) => {
  const taxRate = await taxRatesService.update(req.params.id as string, req.body);
  res.status(200).json(new ApiResponse(200, taxRate, "Tax rate updated successfully"));
});

export const activate = catchAsync(async (req: Request, res: Response) => {
  const taxRate = await taxRatesService.activate(req.params.id as string);
  res.status(200).json(new ApiResponse(200, taxRate, "Tax rate activated successfully"));
});

export const deactivate = catchAsync(async (req: Request, res: Response) => {
  const taxRate = await taxRatesService.deactivate(req.params.id as string);
  res.status(200).json(new ApiResponse(200, taxRate, "Tax rate deactivated successfully"));
});
