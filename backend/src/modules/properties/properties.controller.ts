import { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async";
import { ApiResponse } from "../../utils/api-response";
import { propertiesService } from "./properties.service";

export const getMany = catchAsync(async (req: Request, res: Response) => {
  const result = await propertiesService.findAll(req.query as any, (req as any).user);
  res.status(200).json(new ApiResponse(200, result.data, "Properties retrieved successfully", result.meta));
});

export const getOne = catchAsync(async (req: Request, res: Response) => {
  const property = await propertiesService.findById(req.params.id as string, (req as any).user);
  res.status(200).json(new ApiResponse(200, property, "Property retrieved successfully"));
});

export const create = catchAsync(async (req: Request, res: Response) => {
  const property = await propertiesService.create(req.body, (req as any).user);
  res.status(201).json(new ApiResponse(201, property, "Property created successfully"));
});

export const update = catchAsync(async (req: Request, res: Response) => {
  const property = await propertiesService.update(req.params.id as string, req.body, (req as any).user);
  res.status(200).json(new ApiResponse(200, property, "Property updated successfully"));
});

export const submit = catchAsync(async (req: Request, res: Response) => {
  const property = await propertiesService.submit(req.params.id as string, (req as any).user);
  res.status(200).json(new ApiResponse(200, property, "Property submitted successfully"));
});

export const startReview = catchAsync(async (req: Request, res: Response) => {
  const property = await propertiesService.startReview(req.params.id as string, (req as any).user);
  res.status(200).json(new ApiResponse(200, property, "Property review started"));
});

export const approve = catchAsync(async (req: Request, res: Response) => {
  const property = await propertiesService.approve(req.params.id as string, (req as any).user);
  res.status(200).json(new ApiResponse(200, property, "Property approved successfully"));
});

export const reject = catchAsync(async (req: Request, res: Response) => {
  const property = await propertiesService.reject(req.params.id as string, req.body, (req as any).user);
  res.status(200).json(new ApiResponse(200, property, "Property rejected successfully"));
});

export const archive = catchAsync(async (req: Request, res: Response) => {
  const property = await propertiesService.archive(req.params.id as string, (req as any).user);
  res.status(200).json(new ApiResponse(200, property, "Property archived successfully"));
});
