import { Prisma, AssessmentStatus, UserRole, PropertyStatus } from "@prisma/client";
import { prisma } from "../../config/db";
import { 
  CreateAssessmentDto, 
  UpdateAssessmentDto, 
  AssessmentQueryDto,
  CancelAssessmentDto 
} from "./assessments.types";
import { ApiError } from "../../utils/api-error";

export class AssessmentsService {
  private Decimal = Prisma.Decimal;
  async findAll(query: AssessmentQueryDto, currentUser: any) {
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 10);
    const skip = (page - 1) * limit;

    const where: Prisma.TaxAssessmentWhereInput = {};

    // Role-based access control
    if (currentUser.role === UserRole.USER || query.mine === true) {
      where.property = {
        owner: { userId: currentUser.id }
      };
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.taxYear) {
      where.taxYear = query.taxYear;
    }

    if (query.propertyId) {
      where.propertyId = query.propertyId;
    }

    if (query.ownerId) {
      where.property = {
        ownerId: query.ownerId
      };
    }

    if (query.locationCategoryId) {
      where.property = {
        locationCategoryId: query.locationCategoryId
      };
    }

    if (query.search) {
      where.OR = [
        { property: { houseNumber: { contains: query.search, mode: 'insensitive' } } },
        { property: { fileNumber: { contains: query.search, mode: 'insensitive' } } },
        { property: { owner: { fullName: { contains: query.search, mode: 'insensitive' } } } },
      ];
    }

    const orderBy: Prisma.TaxAssessmentOrderByWithRelationInput = {};
    if (query.sortBy) {
      orderBy[query.sortBy as keyof Prisma.TaxAssessmentOrderByWithRelationInput] = query.sortOrder || "desc";
    } else {
      orderBy.createdAt = "desc";
    }

    const [total, data] = await prisma.$transaction([
      prisma.taxAssessment.count({ where }),
      prisma.taxAssessment.findMany({
        where,
        include: {
          property: {
            include: { 
              owner: true,
              locationCategory: true
            }
          },
          taxRate: true,
          issuedBy: { select: { id: true, name: true, email: true } },
          approvedBy: { select: { id: true, name: true, email: true } },
        },
        orderBy,
        skip,
        take: limit,
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string, currentUser: any) {
    const assessment = await prisma.taxAssessment.findUnique({
      where: { id },
      include: {
        property: {
          include: { 
            owner: true,
            locationCategory: true
          }
        },
        taxRate: true,
        issuedBy: { select: { id: true, name: true, email: true } },
        approvedBy: { select: { id: true, name: true, email: true } },
        cancelledBy: { select: { id: true, name: true, email: true } },
      }
    });

    if (!assessment) {
      throw new ApiError(404, "Assessment not found");
    }

    // Role-based access control
    if (currentUser.role === UserRole.USER) {
      if (assessment.property.owner.userId !== currentUser.id) {
        throw new ApiError(403, "You do not have permission to view this assessment");
      }
    }

    return assessment;
  }

  async create(data: CreateAssessmentDto, currentUser: any) {
    // 1. Fetch and validate property
    const property = await prisma.property.findUnique({
      where: { id: data.propertyId },
      include: { locationCategory: true }
    });

    if (!property) {
      throw new ApiError(404, "Property not found");
    }

    if (property.status !== PropertyStatus.APPROVED) {
      throw new ApiError(400, "Property must be APPROVED before assessment can be generated");
    }

    if (!property.locationCategoryId) {
      throw new ApiError(400, "Property must have a location category assigned");
    }

    // 2. Check for existing assessment for this year
    const existing = await prisma.taxAssessment.findUnique({
      where: {
        propertyId_taxYear: {
          propertyId: data.propertyId,
          taxYear: data.taxYear
        }
      }
    });

    if (existing) {
      throw new ApiError(400, `An assessment already exists for House #${property.houseNumber} in year ${data.taxYear}`);
    }

    // 3. Find active tax rate
    const taxRate = await prisma.taxRate.findFirst({
      where: {
        locationCategoryId: property.locationCategoryId,
        taxYear: data.taxYear,
        isActive: true
      }
    });

    if (!taxRate) {
      throw new ApiError(400, `No active tax rate found for category ${property.locationCategory?.name} in year ${data.taxYear}`);
    }

    // 4. Calculate amounts
    const landSize = property.landSizeKare;
    const rate = taxRate.ratePerKare;
    const baseAmount = landSize.mul(rate);
    const penalty = new this.Decimal(data.penaltyAmount || 0);
    const prevBalance = new this.Decimal(data.previousBalance || 0);
    const totalAmount = baseAmount.add(penalty).add(prevBalance);

    // 5. Determine status
    let status: AssessmentStatus = AssessmentStatus.DRAFT;
    if (data.issueNow) {
      status = AssessmentStatus.ISSUED;
    }

    return prisma.taxAssessment.create({
      data: {
        propertyId: data.propertyId,
        taxRateId: taxRate.id,
        taxYear: data.taxYear,
        landSizeKare: landSize,
        ratePerKare: rate,
        baseAmount,
        penaltyAmount: penalty,
        previousBalance: prevBalance,
        totalAmount,
        status,
        note: data.note,
        dueDate: data.dueDate ? new Date(data.dueDate) : taxRate.dueDate,
        issuedById: data.issueNow ? currentUser.id : null,
        issuedAt: data.issueNow ? new Date() : null,
      }
    });
  }

  async update(id: string, data: UpdateAssessmentDto, currentUser: any) {
    const assessment = await this.findById(id, currentUser);

    if (assessment.status !== AssessmentStatus.DRAFT) {
      throw new ApiError(400, "Only DRAFT assessments can be updated");
    }

    const penalty = data.penaltyAmount !== undefined ? new this.Decimal(data.penaltyAmount) : assessment.penaltyAmount;
    const prevBalance = data.previousBalance !== undefined ? new this.Decimal(data.previousBalance) : assessment.previousBalance;
    const totalAmount = new this.Decimal(assessment.baseAmount).add(penalty).add(prevBalance);

    return prisma.taxAssessment.update({
      where: { id },
      data: {
        penaltyAmount: penalty,
        previousBalance: prevBalance,
        totalAmount,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        note: data.note,
      }
    });
  }

  async recalculate(id: string, currentUser: any) {
    const assessment = await this.findById(id, currentUser);

    if (assessment.status !== AssessmentStatus.DRAFT) {
      throw new ApiError(400, "Only DRAFT assessments can be recalculated");
    }

    const property = await prisma.property.findUnique({
      where: { id: assessment.propertyId }
    });

    if (!property) throw new ApiError(404, "Property not found");

    const taxRate = await prisma.taxRate.findFirst({
      where: {
        locationCategoryId: property.locationCategoryId!,
        taxYear: assessment.taxYear,
        isActive: true
      }
    });

    if (!taxRate) {
      throw new ApiError(400, "No active tax rate found for recalculation");
    }

    const landSize = property.landSizeKare;
    const rate = taxRate.ratePerKare;
    const baseAmount = landSize.mul(rate);
    const totalAmount = baseAmount.add(assessment.penaltyAmount).add(assessment.previousBalance);

    return prisma.taxAssessment.update({
      where: { id },
      data: {
        taxRateId: taxRate.id,
        landSizeKare: landSize,
        ratePerKare: rate,
        baseAmount,
        totalAmount,
      }
    });
  }

  async issue(id: string, currentUser: any) {
    const assessment = await this.findById(id, currentUser);

    if (assessment.status !== AssessmentStatus.DRAFT) {
      throw new ApiError(400, "Only DRAFT assessments can be issued");
    }

    return prisma.taxAssessment.update({
      where: { id },
      data: {
        status: AssessmentStatus.ISSUED,
        issuedById: currentUser.id,
        issuedAt: new Date(),
      }
    });
  }

  async cancel(id: string, data: CancelAssessmentDto, currentUser: any) {
    const assessment = await this.findById(id, currentUser);

    if (assessment.status === AssessmentStatus.PAID) {
      throw new ApiError(400, "Paid assessments cannot be cancelled");
    }

    if (assessment.status === AssessmentStatus.CANCELLED) {
      throw new ApiError(400, "Assessment is already cancelled");
    }

    return prisma.taxAssessment.update({
      where: { id },
      data: {
        status: AssessmentStatus.CANCELLED,
        cancelledById: currentUser.id,
        cancelledAt: new Date(),
        cancellationReason: data.cancellationReason,
      }
    });
  }

  async findByPropertyAndYear(propertyId: string, taxYear: number, currentUser: any) {
    const assessment = await prisma.taxAssessment.findUnique({
      where: {
        propertyId_taxYear: {
          propertyId,
          taxYear
        }
      },
      include: {
        property: {
          include: { owner: true }
        },
        taxRate: true,
      }
    });

    if (assessment && currentUser.role === UserRole.USER) {
      if (assessment.property.owner.userId !== currentUser.id) {
        throw new ApiError(403, "You do not have permission to view this assessment");
      }
    }

    return assessment;
  }
}

export const assessmentsService = new AssessmentsService();
