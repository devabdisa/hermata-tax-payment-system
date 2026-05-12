import { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async";
import { ApiResponse } from "../../utils/api-response";

export const get = catchAsync(async (req: Request, res: Response) => {
  res.status(200).json(new ApiResponse(200, [], "property-owners module ready"));
});

export const create = catchAsync(async (req: Request, res: Response) => {
  res.status(201).json(new ApiResponse(201, {}, "property-owners created (placeholder)"));
});
