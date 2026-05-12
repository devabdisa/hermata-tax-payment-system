import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import authRoutes from "../modules/auth/auth.routes";
import usersRoutes from "../modules/users/users.routes";
import propertyOwnersRoutes from "../modules/property-owners/property-owners.routes";
import propertiesRoutes from "../modules/properties/properties.routes";
import documentsRoutes from "../modules/documents/documents.routes";
import locationCategoriesRoutes from "../modules/location-categories/location-categories.routes";
import taxRatesRoutes from "../modules/tax-rates/tax-rates.routes";
import assessmentsRoutes from "../modules/assessments/assessments.routes";
import paymentsRoutes from "../modules/payments/payments.routes";
import confirmationsRoutes from "../modules/confirmations/confirmations.routes";
import reportsRoutes from "../modules/reports/reports.routes";
import auditLogsRoutes from "../modules/audit-logs/audit-logs.routes";
import settingsRoutes from "../modules/settings/settings.routes";

const router = Router();

// Public routes
router.use("/auth", authRoutes);

// Protected routes (require valid Better Auth session)
router.use(authMiddleware);

router.use("/users", usersRoutes);
router.use("/property-owners", propertyOwnersRoutes);
router.use("/properties", propertiesRoutes);
router.use("/documents", documentsRoutes);
router.use("/location-categories", locationCategoriesRoutes);
router.use("/tax-rates", taxRatesRoutes);
router.use("/assessments", assessmentsRoutes);
router.use("/payments", paymentsRoutes);
router.use("/confirmations", confirmationsRoutes);
router.use("/reports", reportsRoutes);
router.use("/audit-logs", auditLogsRoutes);
router.use("/settings", settingsRoutes);

export default router;
