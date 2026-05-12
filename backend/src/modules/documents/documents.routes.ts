import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";
import { validate } from "../../middleware/validate.middleware";
import { uploadMiddleware } from "../../middleware/upload.middleware";
import { PERMISSIONS } from "../../constants/permissions";
import * as documentsController from "./documents.controller";
import * as documentsValidation from "./documents.validation";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.get(
  "/",
  authorize(PERMISSIONS.DOCUMENTS_VIEW),
  validate({ query: documentsValidation.documentQuerySchema }),
  documentsController.getMany
);

router.get(
  "/:id",
  authorize(PERMISSIONS.DOCUMENTS_VIEW),
  validate({ params: documentsValidation.documentIdParamSchema }),
  documentsController.getOne
);

router.post(
  "/upload",
  authorize(PERMISSIONS.DOCUMENTS_UPLOAD),
  uploadMiddleware("file", 1, undefined, { folder: "property-documents" }),
  validate({ body: documentsValidation.uploadDocumentSchema }),
  documentsController.upload
);

router.patch(
  "/:id",
  authorize(PERMISSIONS.DOCUMENTS_UPLOAD),
  validate({ params: documentsValidation.documentIdParamSchema }),
  validate({ body: documentsValidation.updateDocumentSchema }),
  documentsController.update
);

router.patch(
  "/:id/approve",
  authorize(PERMISSIONS.DOCUMENTS_REVIEW),
  validate({ params: documentsValidation.documentIdParamSchema }),
  documentsController.approve
);

router.patch(
  "/:id/reject",
  authorize(PERMISSIONS.DOCUMENTS_REVIEW),
  validate({ params: documentsValidation.documentIdParamSchema }),
  validate({ body: documentsValidation.rejectDocumentSchema }),
  documentsController.reject
);

router.patch(
  "/:id/replace",
  authorize(PERMISSIONS.DOCUMENTS_UPLOAD),
  uploadMiddleware("file", 1, undefined, { folder: "property-documents" }),
  validate({ params: documentsValidation.documentIdParamSchema }),
  documentsController.replace
);

router.delete(
  "/:id",
  authorize(PERMISSIONS.DOCUMENTS_DELETE),
  validate({ params: documentsValidation.documentIdParamSchema }),
  documentsController.remove
);

export default router;
