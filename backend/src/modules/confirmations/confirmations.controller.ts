import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catch-async';
import { ApiResponse } from '../../utils/api-response';
import { ConfirmationsService } from './confirmations.service';
import { ConfirmationListQuery } from './confirmations.types';

export class ConfirmationsController {
  static listConfirmations = catchAsync(async (req: Request, res: Response) => {
    const query = req.query as unknown as ConfirmationListQuery;
    const result = await ConfirmationsService.listConfirmations(query, req.user);
    res.status(200).send(new ApiResponse(200, result, 'Confirmations retrieved successfully'));
  });

  static getConfirmation = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await ConfirmationsService.getConfirmationById(id, req.user);
    res.status(200).send(new ApiResponse(200, result, 'Confirmation retrieved successfully'));
  });

  static getConfirmationByPayment = catchAsync(async (req: Request, res: Response) => {
    const paymentId = req.params.paymentId as string;
    const result = await ConfirmationsService.getConfirmationByPaymentId(paymentId, req.user);
    res.status(200).send(new ApiResponse(200, result, 'Confirmation retrieved successfully'));
  });

  static createConfirmation = catchAsync(async (req: Request, res: Response) => {
    const result = await ConfirmationsService.createConfirmation(req.body, req.user);
    res.status(201).send(new ApiResponse(201, result, 'Confirmation issued successfully'));
  });

  static createConfirmationForPayment = catchAsync(async (req: Request, res: Response) => {
    const paymentId = req.params.paymentId as string;
    const result = await ConfirmationsService.createConfirmation({ paymentId, ...req.body }, req.user);
    res.status(201).send(new ApiResponse(201, result, 'Confirmation issued successfully'));
  });

  static cancelConfirmation = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await ConfirmationsService.cancelConfirmation(id, req.body, req.user);
    res.status(200).send(new ApiResponse(200, result, 'Confirmation cancelled successfully'));
  });

  static markAsPrinted = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await ConfirmationsService.markAsPrinted(id);
    res.status(200).send(new ApiResponse(200, result, 'Confirmation marked as printed'));
  });
}
