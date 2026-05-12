import { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async";
import { ApiResponse } from "../../utils/api-response";
import { documentsService } from "./documents.service";

export const getMany = catchAsync(async (req: Request, res: Response) => {
  const result = await documentsService.findAll(req.query as any, (req as any).user);
  res.status(200).json(new ApiResponse(200, result.data, "Documents retrieved successfully", result.meta));
});

export const getOne = catchAsync(async (req: Request, res: Response) => {
  const document = await documentsService.findById(req.params.id as string, (req as any).user);
  res.status(200).json(new ApiResponse(200, document, "Document retrieved successfully"));
});

export const upload = catchAsync(async (req: Request, res: Response) => {
  const document = await documentsService.upload(req.body, req.file, (req as any).user);
  res.status(201).json(new ApiResponse(201, document, "Document uploaded successfully"));
});

export const update = catchAsync(async (req: Request, res: Response) => {
  const document = await documentsService.update(req.params.id as string, req.body, (req as any).user);
  res.status(200).json(new ApiResponse(200, document, "Document metadata updated successfully"));
});

export const approve = catchAsync(async (req: Request, res: Response) => {
  const document = await documentsService.approve(req.params.id as string, (req as any).user);
  res.status(200).json(new ApiResponse(200, document, "Document approved successfully"));
});

export const reject = catchAsync(async (req: Request, res: Response) => {
  const document = await documentsService.reject(req.params.id as string, req.body, (req as any).user);
  res.status(200).json(new ApiResponse(200, document, "Document rejected successfully"));
});

export const replace = catchAsync(async (req: Request, res: Response) => {
  const document = await documentsService.replace(req.params.id as string, req.file, (req as any).user);
  res.status(200).json(new ApiResponse(200, document, "Document file replaced successfully"));
});

export const remove = catchAsync(async (req: Request, res: Response) => {
  await documentsService.delete(req.params.id as string, (req as any).user);
  res.status(200).json(new ApiResponse(200, null, "Document deleted successfully"));
});
