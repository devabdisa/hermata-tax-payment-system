import { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async";
import { ApiResponse } from "../../utils/api-response";
import { paymentsService } from "./payments.service";

export const getMany = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentsService.findAll(req.query as any, (req as any).user);
  res.status(200).json(new ApiResponse(200, result.data, "Payments retrieved successfully", result.meta));
});

export const getOne = catchAsync(async (req: Request, res: Response) => {
  const payment = await paymentsService.findById(req.params.id as string, (req as any).user);
  res.status(200).json(new ApiResponse(200, payment, "Payment retrieved successfully"));
});

export const createSinqeeReceipt = catchAsync(async (req: Request, res: Response) => {
  const payment = await paymentsService.createSinqeeReceiptPayment(
    req.body,
    req.file,
    (req as any).user
  );
  res.status(201).json(new ApiResponse(201, payment, "Sinqee Bank receipt payment submitted. Awaiting verification."));
});

export const verify = catchAsync(async (req: Request, res: Response) => {
  const payment = await paymentsService.verifyPayment(req.params.id as string, (req as any).user);
  res.status(200).json(new ApiResponse(200, payment, "Payment verified successfully. Assessment marked as PAID."));
});

export const reject = catchAsync(async (req: Request, res: Response) => {
  const payment = await paymentsService.rejectPayment(req.params.id as string, req.body, (req as any).user);
  res.status(200).json(new ApiResponse(200, payment, "Payment rejected successfully"));
});

export const cancel = catchAsync(async (req: Request, res: Response) => {
  const payment = await paymentsService.cancelPayment(req.params.id as string, req.body, (req as any).user);
  res.status(200).json(new ApiResponse(200, payment, "Payment cancelled successfully"));
});

export const initiateChapa = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentsService.initiateChapaPayment(req.body, (req as any).user);
  res.status(201).json(new ApiResponse(201, result, "Chapa payment initiated. Redirect user to checkoutUrl."));
});

export const verifyChapa = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentsService.verifyChapaPayment(req.params.txRef as string, (req as any).user);
  res.status(200).json(new ApiResponse(200, result, "Chapa transaction verified"));
});

export const chapaWebhook = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentsService.handleChapaWebhook(req.body);
  res.status(200).json({ received: true, details: result });
});
