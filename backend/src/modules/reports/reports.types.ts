export interface DashboardReport {
  propertiesTotal: number;
  propertiesApproved: number;
  propertiesPendingReview: number;
  propertiesRejected: number;
  documentsPendingReview: number;
  assessmentsTotal: number;
  assessmentsIssued: number;
  assessmentsPaid: number;
  assessmentsUnpaid: number;
  totalAssessedAmount: number;
  totalCollectedAmount: number;
  totalUnpaidAmount: number;
  paymentsPendingReview: number;
  paymentsVerified: number;
  confirmationsIssued: number;
  pendingWorkCount: number;
  paidWithoutConfirmation: number;
}

export interface CollectionSummary {
  totalCollectedAmount: number;
  totalVerifiedPayments: number;
  collectionByMethod: { method: string; total: number; count: number }[];
  collectionByLocationCategory: { category: string; total: number; count: number }[];
  collectionByTaxYear: { taxYear: number; total: number; count: number }[];
}

export interface UnpaidReport {
  summary: {
    totalUnpaidAmount: number;
    unpaidCount: number;
    overdueCount: number;
  };
  items: any[];
}

export interface PendingWorkReport {
  pendingProperties: number;
  pendingDocuments: number;
  pendingPayments: number;
  issuedUnpaidAssessments: number;
  paidWithoutConfirmation: number;
}
