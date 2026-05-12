import { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async";
import { ApiResponse } from "../../utils/api-response";
import { assessmentsService } from "./assessments.service";

export const getMany = catchAsync(async (req: Request, res: Response) => {
  const result = await assessmentsService.findAll(req.query as any, (req as any).user);
  res.status(200).json(new ApiResponse(200, result.data, "Assessments retrieved successfully", result.meta));
});

export const getOne = catchAsync(async (req: Request, res: Response) => {
  const assessment = await assessmentsService.findById(req.params.id as string, (req as any).user);
  res.status(200).json(new ApiResponse(200, assessment, "Assessment retrieved successfully"));
});

export const create = catchAsync(async (req: Request, res: Response) => {
  const assessment = await assessmentsService.create(req.body, (req as any).user);
  res.status(201).json(new ApiResponse(201, assessment, "Assessment created successfully"));
});

export const update = catchAsync(async (req: Request, res: Response) => {
  const assessment = await assessmentsService.update(req.params.id as string, req.body, (req as any).user);
  res.status(200).json(new ApiResponse(200, assessment, "Assessment updated successfully"));
});

export const recalculate = catchAsync(async (req: Request, res: Response) => {
  const assessment = await assessmentsService.recalculate(req.params.id as string, (req as any).user);
  res.status(200).json(new ApiResponse(200, assessment, "Assessment recalculated successfully"));
});

export const issue = catchAsync(async (req: Request, res: Response) => {
  const assessment = await assessmentsService.issue(req.params.id as string, (req as any).user);
  res.status(200).json(new ApiResponse(200, assessment, "Assessment issued successfully"));
});

export const cancel = catchAsync(async (req: Request, res: Response) => {
  const assessment = await assessmentsService.cancel(req.params.id as string, req.body, (req as any).user);
  res.status(200).json(new ApiResponse(200, assessment, "Assessment cancelled successfully"));
});

export const getByPropertyAndYear = catchAsync(async (req: Request, res: Response) => {
  const assessment = await assessmentsService.findByPropertyAndYear(
    req.params.propertyId as string,
    parseInt(req.params.taxYear as string, 10),
    (req as any).user
  );
  res.status(200).json(new ApiResponse(200, assessment, "Assessment retrieved successfully"));
});
