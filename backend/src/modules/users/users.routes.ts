import { Router } from "express";
import * as usersController from "./users.controller";
import { validate } from "../../middleware/validate.middleware";
import { createUserSchema, updateUserSchema, userQuerySchema } from "./users.validation";
import { authorize } from "../../middleware/authorize.middleware";
import { PERMISSIONS } from "../../constants/permissions";

const router = Router();

// /me is accessible to any authenticated user
router.get("/me", usersController.getMe);

// Other user management routes require USERS_MANAGE permission
router.get("/", 
  authorize(PERMISSIONS.USERS_MANAGE),
  validate({ query: userQuerySchema }), 
  usersController.listUsers
);

router.get("/:id", 
  authorize(PERMISSIONS.USERS_MANAGE),
  usersController.getUser
);

router.post("/", 
  authorize(PERMISSIONS.USERS_MANAGE),
  validate({ body: createUserSchema }), 
  usersController.createUser
);

router.patch("/:id", 
  authorize(PERMISSIONS.USERS_MANAGE),
  validate({ body: updateUserSchema }), 
  usersController.updateUser
);

router.delete("/:id", 
  authorize(PERMISSIONS.USERS_MANAGE),
  usersController.deleteUser
);

export default router;
