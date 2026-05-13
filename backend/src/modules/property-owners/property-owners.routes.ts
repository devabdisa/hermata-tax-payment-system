import { Router } from "express";
import * as propertyOwnersController from "./property-owners.controller";
import { validate } from "../../middleware/validate.middleware";
import { createPropertyOwnerSchema, updatePropertyOwnerSchema, propertyOwnerQuerySchema, upsertMyPropertyOwnerSchema } from "./property-owners.validation";
import { authorize } from "../../middleware/authorize.middleware";
import { PERMISSIONS } from "../../constants/permissions";

const router = Router();

router.get("/", 
  authorize(PERMISSIONS.PROPERTY_OWNERS_VIEW),
  validate({ query: propertyOwnerQuerySchema }), 
  propertyOwnersController.listOwners
);

router.get("/me", propertyOwnersController.getMyOwnerProfile);

router.put("/me", validate({ body: upsertMyPropertyOwnerSchema }), propertyOwnersController.upsertMyOwnerProfile);

router.get("/:id", 
  authorize(PERMISSIONS.PROPERTY_OWNERS_VIEW),
  propertyOwnersController.getOwner
);

router.post("/", 
  authorize(PERMISSIONS.PROPERTY_OWNERS_MANAGE),
  validate({ body: createPropertyOwnerSchema }), 
  propertyOwnersController.createOwner
);

router.patch("/:id", 
  authorize(PERMISSIONS.PROPERTY_OWNERS_MANAGE),
  validate({ body: updatePropertyOwnerSchema }), 
  propertyOwnersController.updateOwner
);

router.delete("/:id", 
  authorize(PERMISSIONS.PROPERTY_OWNERS_MANAGE),
  propertyOwnersController.deleteOwner
);

export default router;
