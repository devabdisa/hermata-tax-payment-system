import { Prisma } from "@prisma/client";
import { prisma } from "../../config/db";
import { CreateTaxRateDto, UpdateTaxRateDto, TaxRateQueryDto } from "./tax-rates.types";
import { ApiError } from "../../utils/api-error";

export class TaxRatesService {
  async findAll(query: TaxRateQueryDto) {
    const page = parseInt(query.page || "1", 10);
    const limit = parseInt(query.limit || "10", 10);
    const skip = (page - 1) * limit;

    const where: Prisma.TaxRateWhereInput = {};

    if (query.taxYear) {
      where.taxYear = parseInt(query.taxYear, 10);
    }

    if (query.locationCategoryId) {
      where.locationCategoryId = query.locationCategoryId;
    }

    if (query.isActive !== undefined) {
      where.isActive = query.isActive === "true";
    }

    // Note: search could be implemented if there were text fields, 
    // but taxRate mostly has numbers and relations.
    // If needed, we could search location category name, but keeping it simple for now.

    const orderBy: Prisma.TaxRateOrderByWithRelationInput = {};
    if (query.sortBy) {
      orderBy[query.sortBy as keyof Prisma.TaxRateOrderByWithRelationInput] = query.sortOrder || "asc";
    } else {
      orderBy.taxYear = "desc";
    }

    const [total, data] = await prisma.$transaction([
      prisma.taxRate.count({ where }),
      prisma.taxRate.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          locationCategory: true,
        },
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

  async findById(id: string) {
    const taxRate = await prisma.taxRate.findUnique({
      where: { id },
      include: {
        locationCategory: true,
      },
    });
    if (!taxRate) {
      throw new ApiError(404, "Tax rate not found");
    }
    return taxRate;
  }

  async create(data: CreateTaxRateDto, userId: string) {
    // Ensure location category exists
    const locationCategory = await prisma.locationCategory.findUnique({
      where: { id: data.locationCategoryId },
    });
    if (!locationCategory) {
      throw new ApiError(400, "Location category does not exist");
    }

    // Check for uniqueness: taxYear + locationCategoryId
    const existing = await prisma.taxRate.findUnique({
      where: {
        taxYear_locationCategoryId: {
          taxYear: data.taxYear,
          locationCategoryId: data.locationCategoryId,
        },
      },
    });

    if (existing) {
      throw new ApiError(400, "Tax rate for this year and location category already exists");
    }

    return prisma.taxRate.create({
      data: {
        taxYear: data.taxYear,
        locationCategoryId: data.locationCategoryId,
        ratePerKare: data.ratePerKare,
        penaltyType: data.penaltyType,
        penaltyValue: data.penaltyValue,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        isActive: data.isActive ?? true,
        createdById: userId, // Using the authenticated user ID
      },
    });
  }

  async update(id: string, data: UpdateTaxRateDto) {
    const taxRate = await this.findById(id);

    if (
      (data.taxYear && data.taxYear !== taxRate.taxYear) ||
      (data.locationCategoryId && data.locationCategoryId !== taxRate.locationCategoryId)
    ) {
      const existing = await prisma.taxRate.findUnique({
        where: {
          taxYear_locationCategoryId: {
            taxYear: data.taxYear || taxRate.taxYear,
            locationCategoryId: data.locationCategoryId || taxRate.locationCategoryId,
          },
        },
      });

      if (existing && existing.id !== id) {
        throw new ApiError(400, "Tax rate for this year and location category already exists");
      }
    }

    return prisma.taxRate.update({
      where: { id },
      data: {
        ...data,
        dueDate: data.dueDate !== undefined ? (data.dueDate ? new Date(data.dueDate) : null) : undefined,
      },
    });
  }

  async activate(id: string) {
    await this.findById(id);
    return prisma.taxRate.update({
      where: { id },
      data: { isActive: true },
    });
  }

  async deactivate(id: string) {
    await this.findById(id);
    return prisma.taxRate.update({
      where: { id },
      data: { isActive: false },
    });
  }
}

export const taxRatesService = new TaxRatesService();
