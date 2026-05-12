import { Router } from 'express';
import * as reportsController from './reports.controller';
import { validate } from '../../middleware/validate.middleware';
import { authMiddleware } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorize.middleware';
import { PERMISSIONS } from '../../constants/permissions';
import { reportsValidation } from './reports.validation';

const router = Router();

router.use(authMiddleware);

router.get(
  '/dashboard',
  authorize(PERMISSIONS.REPORTS_VIEW),
  reportsController.getDashboard
);

router.get(
  '/collections',
  authorize(PERMISSIONS.REPORTS_VIEW),
  validate(reportsValidation.getCollections),
  reportsController.getCollections
);

router.get(
  '/unpaid',
  authorize(PERMISSIONS.REPORTS_VIEW),
  validate(reportsValidation.getUnpaid),
  reportsController.getUnpaid
);

router.get(
  '/pending-work',
  authorize(PERMISSIONS.REPORTS_VIEW),
  reportsController.getPendingWork
);

router.get(
  '/properties',
  authorize(PERMISSIONS.REPORTS_VIEW),
  validate(reportsValidation.getProperties),
  reportsController.getPropertiesDistribution
);

router.get(
  '/assessments',
  authorize(PERMISSIONS.REPORTS_VIEW),
  validate(reportsValidation.getAssessments),
  reportsController.getAssessmentsDistribution
);

router.get(
  '/payments',
  authorize(PERMISSIONS.REPORTS_VIEW),
  validate(reportsValidation.getPayments),
  reportsController.getPaymentsDistribution
);

export default router;
