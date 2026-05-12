import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catch-async';
import { ApiResponse } from '../../utils/api-response';
import { reportsService } from './reports.service';

export const getDashboard = catchAsync(async (req: Request, res: Response) => {
  const report = await reportsService.getDashboardReport();
  res.status(200).json(new ApiResponse(200, report, 'Dashboard report retrieved successfully'));
});

export const getCollections = catchAsync(async (req: Request, res: Response) => {
  const report = await reportsService.getCollectionsReport(req.query);
  res.status(200).json(new ApiResponse(200, report, 'Collections report retrieved successfully'));
});

export const getUnpaid = catchAsync(async (req: Request, res: Response) => {
  const report = await reportsService.getUnpaidReport(req.query);
  res.status(200).json(new ApiResponse(200, report, 'Unpaid assessments report retrieved successfully'));
});

export const getPendingWork = catchAsync(async (req: Request, res: Response) => {
  const report = await reportsService.getPendingWorkReport();
  res.status(200).json(new ApiResponse(200, report, 'Pending work report retrieved successfully'));
});

export const getPropertiesDistribution = catchAsync(async (req: Request, res: Response) => {
  const report = await reportsService.getPropertiesDistribution(req.query);
  res.status(200).json(new ApiResponse(200, report, 'Properties distribution report retrieved successfully'));
});

export const getAssessmentsDistribution = catchAsync(async (req: Request, res: Response) => {
  const report = await reportsService.getAssessmentsDistribution(req.query);
  res.status(200).json(new ApiResponse(200, report, 'Assessments distribution report retrieved successfully'));
});

export const getPaymentsDistribution = catchAsync(async (req: Request, res: Response) => {
  const report = await reportsService.getPaymentsDistribution(req.query);
  res.status(200).json(new ApiResponse(200, report, 'Payments distribution report retrieved successfully'));
});
