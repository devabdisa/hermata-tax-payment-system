import { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async";
import { ApiResponse } from "../../utils/api-response";
import { locationCategoriesService } from "./location-categories.service";

export const getMany = catchAsync(async (req: Request, res: Response) => {
  const result = await locationCategoriesService.findAll(req.query);
  res.status(200).json(new ApiResponse(200, result.data, "Location categories retrieved successfully", result.meta));
});

export const getOne = catchAsync(async (req: Request, res: Response) => {
  const category = await locationCategoriesService.findById(req.params.id as string);
  res.status(200).json(new ApiResponse(200, category, "Location category retrieved successfully"));
});

export const create = catchAsync(async (req: Request, res: Response) => {
  const category = await locationCategoriesService.create(req.body);
  res.status(201).json(new ApiResponse(201, category, "Location category created successfully"));
});

export const update = catchAsync(async (req: Request, res: Response) => {
  const category = await locationCategoriesService.update(req.params.id as string, req.body);
  res.status(200).json(new ApiResponse(200, category, "Location category updated successfully"));
});

export const activate = catchAsync(async (req: Request, res: Response) => {
  const category = await locationCategoriesService.activate(req.params.id as string);
  res.status(200).json(new ApiResponse(200, category, "Location category activated successfully"));
});

export const deactivate = catchAsync(async (req: Request, res: Response) => {
  const category = await locationCategoriesService.deactivate(req.params.id as string);
  res.status(200).json(new ApiResponse(200, category, "Location category deactivated successfully"));
});
