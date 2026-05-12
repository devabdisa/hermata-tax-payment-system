import { Router } from "express";
import * as taxRatesController from "./tax-rates.controller";
import { validate } from "../../middleware/validate.middleware";
import { authMiddleware } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";
import { PERMISSIONS } from "../../constants/permissions";
import { 
  createTaxRateSchema, 
  updateTaxRateSchema, 
  taxRateQuerySchema 
} from "./tax-rates.validation";

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

router.get(
  "/",
  authorize(PERMISSIONS.TAX_RATES_VIEW, PERMISSIONS.TAX_RATES_MANAGE),
  validate({ query: taxRateQuerySchema }),
  taxRatesController.getMany
);

router.get(
  "/:id",
  authorize(PERMISSIONS.TAX_RATES_VIEW, PERMISSIONS.TAX_RATES_MANAGE),
  taxRatesController.getOne
);

router.post(
  "/",
  authorize(PERMISSIONS.TAX_RATES_MANAGE),
  validate({ body: createTaxRateSchema }),
  taxRatesController.create
);

router.patch(
  "/:id",
  authorize(PERMISSIONS.TAX_RATES_MANAGE),
  validate({ body: updateTaxRateSchema }),
  taxRatesController.update
);

router.patch(
  "/:id/activate",
  authorize(PERMISSIONS.TAX_RATES_MANAGE),
  taxRatesController.activate
);

router.patch(
  "/:id/deactivate",
  authorize(PERMISSIONS.TAX_RATES_MANAGE),
  taxRatesController.deactivate
);

export default router;
