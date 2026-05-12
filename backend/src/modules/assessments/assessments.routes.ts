import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";
import { validate } from "../../middleware/validate.middleware";
import { PERMISSIONS } from "../../constants/permissions";
import * as assessmentsController from "./assessments.controller";
import * as assessmentsValidation from "./assessments.validation";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.get(
  "/",
  authorize(PERMISSIONS.ASSESSMENTS_VIEW),
  validate({ query: assessmentsValidation.assessmentQuerySchema }),
  assessmentsController.getMany
);

router.get(
  "/:id",
  authorize(PERMISSIONS.ASSESSMENTS_VIEW),
  validate({ params: assessmentsValidation.assessmentIdParamSchema }),
  assessmentsController.getOne
);

router.get(
  "/property/:propertyId/year/:taxYear",
  authorize(PERMISSIONS.ASSESSMENTS_VIEW),
  validate({ params: assessmentsValidation.propertyYearParamSchema }),
  assessmentsController.getByPropertyAndYear
);

router.post(
  "/",
  authorize(PERMISSIONS.ASSESSMENTS_CREATE),
  validate({ body: assessmentsValidation.createAssessmentSchema }),
  assessmentsController.create
);

router.patch(
  "/:id",
  authorize(PERMISSIONS.ASSESSMENTS_CREATE), // Or define ASSESSMENTS_UPDATE if needed
  validate({ params: assessmentsValidation.assessmentIdParamSchema }),
  validate({ body: assessmentsValidation.updateAssessmentSchema }),
  assessmentsController.update
);

router.patch(
  "/:id/recalculate",
  authorize(PERMISSIONS.ASSESSMENTS_CREATE),
  validate({ params: assessmentsValidation.assessmentIdParamSchema }),
  assessmentsController.recalculate
);

router.patch(
  "/:id/issue",
  authorize(PERMISSIONS.ASSESSMENTS_APPROVE), // Or define ASSESSMENTS_ISSUE
  validate({ params: assessmentsValidation.assessmentIdParamSchema }),
  assessmentsController.issue
);

router.patch(
  "/:id/cancel",
  authorize(PERMISSIONS.ASSESSMENTS_APPROVE), // Or define ASSESSMENTS_CANCEL
  validate({ params: assessmentsValidation.assessmentIdParamSchema }),
  validate({ body: assessmentsValidation.cancelAssessmentSchema }),
  assessmentsController.cancel
);

export default router;
