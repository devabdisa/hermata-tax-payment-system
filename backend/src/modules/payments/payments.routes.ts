import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";
import { validate } from "../../middleware/validate.middleware";
import { uploadMiddleware } from "../../middleware/upload.middleware";
import { PERMISSIONS } from "../../constants/permissions";
import * as controller from "./payments.controller";
import * as v from "./payments.validation";

const router = Router();

// Chapa webhook does NOT require auth (Chapa calls it externally)
router.post("/chapa/webhook", controller.chapaWebhook);

// All other routes require authentication
router.use(authMiddleware);

// -- General --
router.get(
  "/",
  authorize(PERMISSIONS.PAYMENTS_VIEW),
  validate({ query: v.listPaymentsQuerySchema }),
  controller.getMany
);

router.get(
  "/:id",
  authorize(PERMISSIONS.PAYMENTS_VIEW),
  validate({ params: v.paymentIdParamSchema }),
  controller.getOne
);

// -- Sinqee Bank --
router.post(
  "/sinqee-receipt",
  authorize(PERMISSIONS.PAYMENTS_CREATE),
  uploadMiddleware(
    "file",
    1,
    ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"],
    { folder: "payment-receipts" }
  ),
  validate({ body: v.createSinqeeReceiptPaymentSchema }),
  controller.createSinqeeReceipt
);

router.patch(
  "/:id/verify",
  authorize(PERMISSIONS.PAYMENTS_VERIFY),
  validate({ params: v.paymentIdParamSchema }),
  controller.verify
);

router.patch(
  "/:id/reject",
  authorize(PERMISSIONS.PAYMENTS_VERIFY),
  validate({ params: v.paymentIdParamSchema }),
  validate({ body: v.rejectPaymentSchema }),
  controller.reject
);

router.patch(
  "/:id/cancel",
  authorize(PERMISSIONS.PAYMENTS_CREATE),
  validate({ params: v.paymentIdParamSchema }),
  validate({ body: v.cancelPaymentSchema }),
  controller.cancel
);

// -- Chapa --
router.post(
  "/chapa/initiate",
  authorize(PERMISSIONS.PAYMENTS_CREATE),
  validate({ body: v.initiateChapaPaymentSchema }),
  controller.initiateChapa
);

router.get(
  "/chapa/verify/:txRef",
  authorize(PERMISSIONS.PAYMENTS_CREATE),
  validate({ params: v.txRefParamSchema }),
  controller.verifyChapa
);

export default router;
