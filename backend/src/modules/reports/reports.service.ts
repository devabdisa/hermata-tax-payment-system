import { PrismaClient, PropertyStatus, DocumentStatus, AssessmentStatus, PaymentStatus, ConfirmationStatus } from '@prisma/client';
import { DashboardReport, CollectionSummary, UnpaidReport, PendingWorkReport } from './reports.types';

const prisma = new PrismaClient();

export const reportsService = {
  getDashboardReport: async (): Promise<DashboardReport> => {
    const [
      propertiesTotal,
      propertiesApproved,
      propertiesPendingReview,
      propertiesRejected,
      documentsPendingReview,
      assessmentsTotalCount,
      assessmentsIssued,
      assessmentsPaid,
      assessmentsOverdue,
      totalAssessedResult,
      totalCollectedResult,
      totalUnpaidResult,
      paymentsPendingReview,
      paymentsVerified,
      confirmationsIssued,
    ] = await Promise.all([
      prisma.property.count(),
      prisma.property.count({ where: { status: PropertyStatus.APPROVED } }),
      prisma.property.count({ where: { status: { in: [PropertyStatus.SUBMITTED, PropertyStatus.UNDER_REVIEW] } } }),
      prisma.property.count({ where: { status: PropertyStatus.REJECTED } }),
      prisma.propertyDocument.count({ where: { status: DocumentStatus.PENDING } }),
      prisma.taxAssessment.count({ where: { status: { not: AssessmentStatus.CANCELLED } } }),
      prisma.taxAssessment.count({ where: { status: AssessmentStatus.ISSUED } }),
      prisma.taxAssessment.count({ where: { status: AssessmentStatus.PAID } }),
      prisma.taxAssessment.count({ where: { status: AssessmentStatus.OVERDUE } }),
      prisma.taxAssessment.aggregate({
        where: { status: { in: [AssessmentStatus.ISSUED, AssessmentStatus.PAID, AssessmentStatus.OVERDUE] } },
        _sum: { totalAmount: true },
      }),
      prisma.payment.aggregate({
        where: { status: PaymentStatus.VERIFIED },
        _sum: { amount: true },
      }),
      prisma.taxAssessment.aggregate({
        where: { status: { in: [AssessmentStatus.ISSUED, AssessmentStatus.OVERDUE] } },
        _sum: { totalAmount: true },
      }),
      prisma.payment.count({ where: { status: { in: [PaymentStatus.PENDING, PaymentStatus.UNDER_REVIEW] } } }),
      prisma.payment.count({ where: { status: PaymentStatus.VERIFIED } }),
      prisma.kebeleConfirmation.count({ where: { status: ConfirmationStatus.ISSUED } }),
    ]);

    // Paid but no confirmation issued
    const paidWithoutConfirmation = await prisma.taxAssessment.count({
      where: {
        status: AssessmentStatus.PAID,
        payments: {
          some: {
            status: PaymentStatus.VERIFIED,
            confirmation: null
          }
        }
      }
    });

    const pendingWorkCount = 
      propertiesPendingReview + 
      documentsPendingReview + 
      paymentsPendingReview + 
      assessmentsIssued + 
      assessmentsOverdue +
      paidWithoutConfirmation;

    return {
      propertiesTotal,
      propertiesApproved,
      propertiesPendingReview,
      propertiesRejected,
      documentsPendingReview,
      assessmentsTotal: assessmentsTotalCount,
      assessmentsIssued,
      assessmentsPaid,
      assessmentsUnpaid: assessmentsIssued + assessmentsOverdue,
      totalAssessedAmount: Number(totalAssessedResult._sum.totalAmount || 0),
      totalCollectedAmount: Number(totalCollectedResult._sum.amount || 0),
      totalUnpaidAmount: Number(totalUnpaidResult._sum.totalAmount || 0),
      paymentsPendingReview,
      paymentsVerified,
      confirmationsIssued,
      pendingWorkCount,
      paidWithoutConfirmation,
    };
  },

  getCollectionsReport: async (filters: any): Promise<CollectionSummary> => {
    const { fromDate, toDate, taxYear, locationCategoryId, paymentMethod } = filters;

    const where: any = {
      status: PaymentStatus.VERIFIED,
    };

    if (fromDate || toDate) {
      where.paidAt = {};
      if (fromDate) where.paidAt.gte = new Date(fromDate);
      if (toDate) where.paidAt.lte = new Date(toDate);
    }

    if (paymentMethod) {
      where.method = paymentMethod;
    }

    if (taxYear || locationCategoryId) {
      where.assessment = {};
      if (taxYear) where.assessment.taxYear = parseInt(taxYear);
      if (locationCategoryId) where.assessment.property = { locationCategoryId };
    }

    const totalCollectedResult = await prisma.payment.aggregate({
      where,
      _sum: { amount: true },
      _count: { id: true },
    });

    const collectionByMethod = await prisma.payment.groupBy({
      by: ['method'],
      where,
      _sum: { amount: true },
      _count: { id: true },
    });

    const collectionByTaxYear = await prisma.payment.groupBy({
      by: ['assessmentId'], // We need to handle this carefully since taxYear is in assessment
      where,
      _sum: { amount: true },
      _count: { id: true },
    });
    
    // For more complex groupings that Prisma doesn't support easily in one call, 
    // we might need to fetch and transform or use multiple queries.
    
    // Simple grouped collection by method
    const payments = await prisma.payment.findMany({
      where,
      include: {
        assessment: {
          include: {
            property: {
              include: {
                locationCategory: true
              }
            }
          }
        }
      }
    });

    const byCategory: Record<string, { total: number, count: number }> = {};
    const byTaxYear: Record<number, { total: number, count: number }> = {};

    payments.forEach(p => {
      const catName = p.assessment?.property?.locationCategory?.name || "Unknown";
      const year = p.assessment?.taxYear || 0;
      const amount = Number(p.amount);

      if (!byCategory[catName]) byCategory[catName] = { total: 0, count: 0 };
      byCategory[catName].total += amount;
      byCategory[catName].count += 1;

      if (!byTaxYear[year]) byTaxYear[year] = { total: 0, count: 0 };
      byTaxYear[year].total += amount;
      byTaxYear[year].count += 1;
    });

    const formattedByMethod = collectionByMethod.map(item => ({
      method: item.method,
      total: Number(item._sum.amount || 0),
      count: item._count.id
    }));

    const formattedByCategory = Object.entries(byCategory).map(([category, stats]) => ({
      category,
      ...stats
    }));

    const formattedByYear = Object.entries(byTaxYear).map(([year, stats]) => ({
      taxYear: parseInt(year),
      ...stats
    }));

    return {
      totalCollectedAmount: Number(totalCollectedResult._sum.amount || 0),
      totalVerifiedPayments: totalCollectedResult._count.id,
      collectionByMethod: formattedByMethod,
      collectionByLocationCategory: formattedByCategory,
      collectionByTaxYear: formattedByYear,
    };
  },

  getUnpaidReport: async (filters: any): Promise<UnpaidReport> => {
    const { page = 1, limit = 10, taxYear, locationCategoryId, search } = filters;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {
      status: { in: [AssessmentStatus.ISSUED, AssessmentStatus.OVERDUE] },
    };

    if (taxYear) where.taxYear = parseInt(taxYear);
    if (locationCategoryId) where.property = { locationCategoryId };
    if (search) {
      where.property = {
        ...where.property,
        OR: [
          { houseNumber: { contains: search, mode: 'insensitive' } },
          { fileNumber: { contains: search, mode: 'insensitive' } },
          { owner: { fullName: { contains: search, mode: 'insensitive' } } },
        ],
      };
    }

    const [totalUnpaidResult, unpaidCount, overdueCount, items] = await Promise.all([
      prisma.taxAssessment.aggregate({
        where,
        _sum: { totalAmount: true },
      }),
      prisma.taxAssessment.count({ where }),
      prisma.taxAssessment.count({ where: { ...where, status: AssessmentStatus.OVERDUE } }),
      prisma.taxAssessment.findMany({
        where,
        include: {
          property: {
            include: {
              owner: true,
              locationCategory: true,
            }
          }
        },
        skip,
        take: parseInt(limit as string),
        orderBy: { dueDate: 'asc' },
      }),
    ]);

    return {
      summary: {
        totalUnpaidAmount: Number(totalUnpaidResult._sum.totalAmount || 0),
        unpaidCount,
        overdueCount,
      },
      items,
    };
  },

  getPendingWorkReport: async (): Promise<PendingWorkReport> => {
    const [
      pendingProperties,
      pendingDocuments,
      pendingPayments,
      issuedUnpaidAssessments,
      paidWithoutConfirmation,
    ] = await Promise.all([
      prisma.property.count({ where: { status: { in: [PropertyStatus.SUBMITTED, PropertyStatus.UNDER_REVIEW] } } }),
      prisma.propertyDocument.count({ where: { status: DocumentStatus.PENDING } }),
      prisma.payment.count({ where: { status: { in: [PaymentStatus.PENDING, PaymentStatus.UNDER_REVIEW] } } }),
      prisma.taxAssessment.count({ where: { status: { in: [AssessmentStatus.ISSUED, AssessmentStatus.OVERDUE] } } }),
      prisma.taxAssessment.count({
        where: {
          status: AssessmentStatus.PAID,
          payments: {
            some: {
              status: PaymentStatus.VERIFIED,
              confirmation: null
            }
          }
        }
      }),
    ]);

    return {
      pendingProperties,
      pendingDocuments,
      pendingPayments,
      issuedUnpaidAssessments,
      paidWithoutConfirmation,
    };
  },

  getPropertiesDistribution: async (filters: any) => {
    const { locationCategoryId, status } = filters;
    const where: any = {};
    if (locationCategoryId) where.locationCategoryId = locationCategoryId;
    if (status) where.status = status;

    const [totalProperties, byStatus, byCategory, byOwnership] = await Promise.all([
      prisma.property.count({ where }),
      prisma.property.groupBy({
        by: ['status'],
        where,
        _count: { id: true },
      }),
      prisma.property.groupBy({
        by: ['locationCategoryId'],
        where,
        _count: { id: true },
      }),
      prisma.property.groupBy({
        by: ['ownershipType'],
        where,
        _count: { id: true },
      }),
    ]);

    return {
      totalProperties,
      byStatus: byStatus.map(s => ({ status: s.status, count: s._count.id })),
      byCategory: byCategory.map(c => ({ categoryId: c.locationCategoryId, count: c._count.id })),
      byOwnership: byOwnership.map(o => ({ type: o.ownershipType, count: o._count.id })),
    };
  },

  getAssessmentsDistribution: async (filters: any) => {
    const { taxYear, status, locationCategoryId } = filters;
    const where: any = {
      status: { not: AssessmentStatus.CANCELLED }
    };
    if (taxYear) where.taxYear = parseInt(taxYear);
    if (status) where.status = status;
    if (locationCategoryId) where.property = { locationCategoryId };

    const [totalAssessments, totalAmountResult, byStatus, byTaxYear] = await Promise.all([
      prisma.taxAssessment.count({ where }),
      prisma.taxAssessment.aggregate({
        where,
        _sum: { totalAmount: true },
      }),
      prisma.taxAssessment.groupBy({
        by: ['status'],
        where,
        _count: { id: true },
        _sum: { totalAmount: true },
      }),
      prisma.taxAssessment.groupBy({
        by: ['taxYear'],
        where,
        _count: { id: true },
        _sum: { totalAmount: true },
      }),
    ]);

    return {
      totalAssessments,
      totalAssessedAmount: Number(totalAmountResult._sum.totalAmount || 0),
      byStatus: byStatus.map(s => ({ 
        status: s.status, 
        count: s._count.id,
        totalAmount: Number(s._sum.totalAmount || 0)
      })),
      byTaxYear: byTaxYear.map(y => ({ 
        taxYear: y.taxYear, 
        count: y._count.id,
        totalAmount: Number(y._sum.totalAmount || 0)
      })),
    };
  },

  getPaymentsDistribution: async (filters: any) => {
    const { status, method, taxYear, fromDate, toDate } = filters;
    const where: any = {};
    if (status) where.status = status;
    if (method) where.method = method;
    if (taxYear) where.assessment = { taxYear: parseInt(taxYear) };
    if (fromDate || toDate) {
      where.paidAt = {};
      if (fromDate) where.paidAt.gte = new Date(fromDate);
      if (toDate) where.paidAt.lte = new Date(toDate);
    }

    const [totalPayments, totalCollectedResult, byStatus, byMethod] = await Promise.all([
      prisma.payment.count({ where }),
      prisma.payment.aggregate({
        where: { ...where, status: PaymentStatus.VERIFIED },
        _sum: { amount: true },
      }),
      prisma.payment.groupBy({
        by: ['status'],
        where,
        _count: { id: true },
        _sum: { amount: true },
      }),
      prisma.payment.groupBy({
        by: ['method'],
        where,
        _count: { id: true },
        _sum: { amount: true },
      }),
    ]);

    return {
      totalPayments,
      totalCollectedAmount: Number(totalCollectedResult._sum.amount || 0),
      byStatus: byStatus.map(s => ({ 
        status: s.status, 
        count: s._count.id,
        totalAmount: Number(s._sum.amount || 0)
      })),
      byMethod: byMethod.map(m => ({ 
        method: m.method, 
        count: m._count.id,
        totalAmount: Number(m._sum.amount || 0)
      })),
    };
  }
};
