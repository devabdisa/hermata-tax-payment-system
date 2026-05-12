import { Router } from 'express';
import { ConfirmationsController } from './confirmations.controller';
import { validate } from '../../middleware/validate.middleware';
import { authMiddleware } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorize.middleware';
import { PERMISSIONS } from '../../constants/permissions';
import {
  listConfirmationsQuerySchema,
  confirmationIdParamSchema,
  createConfirmationSchema,
  paymentIdParamSchema,
  cancelConfirmationSchema,
} from './confirmations.validation';

const router = Router();

router.use(authMiddleware);

// List confirmations
router.get(
  '/',
  authorize(PERMISSIONS.CONFIRMATIONS_VIEW),
  validate({ query: listConfirmationsQuerySchema }),
  ConfirmationsController.listConfirmations
);

// Get confirmation by payment ID
router.get(
  '/payment/:paymentId',
  authorize(PERMISSIONS.CONFIRMATIONS_VIEW),
  validate({ params: paymentIdParamSchema }),
  ConfirmationsController.getConfirmationByPayment
);

// Get single confirmation
router.get(
  '/:id',
  authorize(PERMISSIONS.CONFIRMATIONS_VIEW),
  validate({ params: confirmationIdParamSchema }),
  ConfirmationsController.getConfirmation
);

// Issue confirmation
router.post(
  '/',
  authorize(PERMISSIONS.CONFIRMATIONS_CREATE),
  validate({ body: createConfirmationSchema }),
  ConfirmationsController.createConfirmation
);

// Issue confirmation for specific payment from URL
router.post(
  '/payment/:paymentId',
  authorize(PERMISSIONS.CONFIRMATIONS_CREATE),
  validate({
    params: paymentIdParamSchema,
    body: createConfirmationSchema.omit({ paymentId: true }).partial(),
  }),
  ConfirmationsController.createConfirmationForPayment
);

// Cancel confirmation
router.patch(
  '/:id/cancel',
  authorize(PERMISSIONS.CONFIRMATIONS_CANCEL),
  validate({
    params: confirmationIdParamSchema,
    body: cancelConfirmationSchema,
  }),
  ConfirmationsController.cancelConfirmation
);

// Mark as printed
router.patch(
  '/:id/print',
  authorize(PERMISSIONS.CONFIRMATIONS_VIEW),
  validate({ params: confirmationIdParamSchema }),
  ConfirmationsController.markAsPrinted
);

export default router;
