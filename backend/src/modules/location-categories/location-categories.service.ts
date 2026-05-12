import { Prisma } from "@prisma/client";
import { prisma } from "../../config/db";
import { CreateLocationCategoryDto, UpdateLocationCategoryDto, LocationCategoryQueryDto } from "./location-categories.types";
import { ApiError } from "../../utils/api-error";

export class LocationCategoriesService {
  async findAll(query: LocationCategoryQueryDto) {
    const page = parseInt(query.page || "1", 10);
    const limit = parseInt(query.limit || "10", 10);
    const skip = (page - 1) * limit;

    const where: Prisma.LocationCategoryWhereInput = {};

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
        { code: { contains: query.search, mode: "insensitive" } },
        { description: { contains: query.search, mode: "insensitive" } },
      ];
    }

    if (query.isActive !== undefined) {
      where.isActive = query.isActive === "true";
    }

    const orderBy: Prisma.LocationCategoryOrderByWithRelationInput = {};
    if (query.sortBy) {
      orderBy[query.sortBy as keyof Prisma.LocationCategoryOrderByWithRelationInput] = query.sortOrder || "asc";
    } else {
      orderBy.createdAt = "desc";
    }

    const [total, data] = await prisma.$transaction([
      prisma.locationCategory.count({ where }),
      prisma.locationCategory.findMany({
        where,
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

  async findById(id: string) {
    const category = await prisma.locationCategory.findUnique({
      where: { id },
    });
    if (!category) {
      throw new ApiError(404, "Location category not found");
    }
    return category;
  }

  async create(data: CreateLocationCategoryDto) {
    const existing = await prisma.locationCategory.findUnique({
      where: { code: data.code },
    });
    if (existing) {
      throw new ApiError(400, "Location category with this code already exists");
    }

    return prisma.locationCategory.create({
      data: {
        name: data.name,
        code: data.code,
        description: data.description,
        priority: data.priority ?? 0,
        isActive: data.isActive ?? true,
      },
    });
  }

  async update(id: string, data: UpdateLocationCategoryDto) {
    const category = await this.findById(id);

    if (data.code && data.code !== category.code) {
      const existing = await prisma.locationCategory.findUnique({
        where: { code: data.code },
      });
      if (existing) {
        throw new ApiError(400, "Location category with this code already exists");
      }
    }

    return prisma.locationCategory.update({
      where: { id },
      data,
    });
  }

  async activate(id: string) {
    await this.findById(id);
    return prisma.locationCategory.update({
      where: { id },
      data: { isActive: true },
    });
  }

  async deactivate(id: string) {
    await this.findById(id);
    return prisma.locationCategory.update({
      where: { id },
      data: { isActive: false },
    });
  }
}

export const locationCategoriesService = new LocationCategoriesService();
