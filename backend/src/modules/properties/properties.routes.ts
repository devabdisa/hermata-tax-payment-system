import { Router } from "express";
import * as propertiesController from "./properties.controller";
import { validate } from "../../middleware/validate.middleware";
import { authMiddleware } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";
import { PERMISSIONS } from "../../constants/permissions";
import { 
  createPropertySchema, 
  updatePropertySchema, 
  propertyQuerySchema,
  rejectPropertySchema
} from "./properties.validation";

const router = Router();

router.use(authMiddleware);

router.get(
  "/",
  authorize(PERMISSIONS.PROPERTIES_VIEW),
  validate({ query: propertyQuerySchema }),
  propertiesController.getMany
);

router.get(
  "/:id",
  authorize(PERMISSIONS.PROPERTIES_VIEW),
  propertiesController.getOne
);

router.post(
  "/",
  authorize(PERMISSIONS.PROPERTIES_CREATE),
  validate({ body: createPropertySchema }),
  propertiesController.create
);

router.patch(
  "/:id",
  authorize(PERMISSIONS.PROPERTIES_UPDATE),
  validate({ body: updatePropertySchema }),
  propertiesController.update
);

router.patch(
  "/:id/submit",
  authorize(PERMISSIONS.PROPERTIES_CREATE), // Or UPDATE, but CREATE covers House Owner
  propertiesController.submit
);

router.patch(
  "/:id/start-review",
  authorize(PERMISSIONS.PROPERTIES_REVIEW),
  propertiesController.startReview
);

router.patch(
  "/:id/approve",
  authorize(PERMISSIONS.PROPERTIES_APPROVE),
  propertiesController.approve
);

router.patch(
  "/:id/reject",
  authorize(PERMISSIONS.PROPERTIES_APPROVE),
  validate({ body: rejectPropertySchema }),
  propertiesController.reject
);

router.patch(
  "/:id/archive",
  authorize(PERMISSIONS.PROPERTIES_ARCHIVE),
  propertiesController.archive
);

export default router;
