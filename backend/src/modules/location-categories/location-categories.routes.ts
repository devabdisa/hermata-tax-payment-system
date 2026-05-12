import { Router } from "express";
import * as locationCategoriesController from "./location-categories.controller";
import { validate } from "../../middleware/validate.middleware";
import { authMiddleware } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";
import { PERMISSIONS } from "../../constants/permissions";
import { 
  createLocationCategorySchema, 
  updateLocationCategorySchema, 
  locationCategoryQuerySchema 
} from "./location-categories.validation";

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

router.get(
  "/",
  authorize(PERMISSIONS.LOCATION_CATEGORIES_VIEW),
  validate({ query: locationCategoryQuerySchema }),
  locationCategoriesController.getMany
);

router.get(
  "/:id",
  authorize(PERMISSIONS.LOCATION_CATEGORIES_VIEW),
  locationCategoriesController.getOne
);

router.post(
  "/",
  authorize(PERMISSIONS.LOCATION_CATEGORIES_MANAGE),
  validate({ body: createLocationCategorySchema }),
  locationCategoriesController.create
);

router.patch(
  "/:id",
  authorize(PERMISSIONS.LOCATION_CATEGORIES_MANAGE),
  validate({ body: updateLocationCategorySchema }),
  locationCategoriesController.update
);

router.patch(
  "/:id/activate",
  authorize(PERMISSIONS.LOCATION_CATEGORIES_MANAGE),
  locationCategoriesController.activate
);

router.patch(
  "/:id/deactivate",
  authorize(PERMISSIONS.LOCATION_CATEGORIES_MANAGE),
  locationCategoriesController.deactivate
);

export default router;
