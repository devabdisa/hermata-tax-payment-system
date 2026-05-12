import { Prisma, PropertyStatus, UserRole } from "@prisma/client";
import { prisma } from "../../config/db";
import { 
  CreatePropertyDto, 
  UpdatePropertyDto, 
  PropertyQueryDto,
  RejectPropertyDto 
} from "./properties.types";
import { ApiError } from "../../utils/api-error";

export class PropertiesService {
  async findAll(query: PropertyQueryDto, currentUser: any) {
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 10);
    const skip = (page - 1) * limit;

    const where: Prisma.PropertyWhereInput = {};

    // Role-based access control
    if (currentUser.role === UserRole.USER || query.mine === true) {
      // Find the user's owner profile
      const profile = await prisma.houseOwnerProfile.findUnique({
        where: { userId: currentUser.id }
      });
      
      if (!profile) {
        if (query.mine === true || currentUser.role === UserRole.USER) {
          return {
            data: [],
            meta: { total: 0, page, limit, totalPages: 0 }
          };
        }
      } else {
        where.ownerId = profile.id;
      }
    }

    if (query.search) {
      where.OR = [
        { houseNumber: { contains: query.search, mode: 'insensitive' } },
        { fileNumber: { contains: query.search, mode: 'insensitive' } },
        { owner: { fullName: { contains: query.search, mode: 'insensitive' } } },
        { locationDescription: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.ownershipType) {
      where.ownershipType = query.ownershipType;
    }

    if (query.locationCategoryId) {
      where.locationCategoryId = query.locationCategoryId;
    }

    if (query.ownerId) {
      where.ownerId = query.ownerId;
    }

    const orderBy: Prisma.PropertyOrderByWithRelationInput = {};
    if (query.sortBy) {
      orderBy[query.sortBy as keyof Prisma.PropertyOrderByWithRelationInput] = query.sortOrder || "desc";
    } else {
      orderBy.createdAt = "desc";
    }

    const [total, data] = await prisma.$transaction([
      prisma.property.count({ where }),
      prisma.property.findMany({
        where,
        include: {
          owner: true,
          locationCategory: true,
          _count: {
            select: { documents: true }
          }
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
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        owner: true,
        locationCategory: true,
        reviewedBy: { select: { id: true, name: true, email: true } },
        approvedBy: { select: { id: true, name: true, email: true } },
      }
    });

    if (!property) {
      throw new ApiError(404, "Property not found");
    }

    // Role-based access control
    if (currentUser.role === UserRole.USER) {
      const profile = await prisma.houseOwnerProfile.findUnique({
        where: { userId: currentUser.id }
      });
      if (!profile || property.ownerId !== profile.id) {
        throw new ApiError(403, "You do not have permission to view this property");
      }
    }

    return property;
  }

  async create(data: CreatePropertyDto, currentUser: any) {
    let ownerId = data.ownerId;

    // If USER role, enforce they are the owner
    if (currentUser.role === UserRole.USER) {
      const profile = await prisma.houseOwnerProfile.findUnique({
        where: { userId: currentUser.id }
      });
      if (!profile) {
        throw new ApiError(400, "User profile is required to register a property. Please complete your profile first.");
      }
      ownerId = profile.id;
    } else {
      // Worker/Admin flow - ownerId is required
      if (!ownerId) {
        throw new ApiError(400, "ownerId is required for manual registration");
      }
      // Validate owner profile exists
      const profile = await prisma.houseOwnerProfile.findUnique({
        where: { id: ownerId }
      });
      if (!profile) {
        throw new ApiError(404, "Owner profile not found");
      }
    }

    // Check unique constraints
    const existingHouse = await prisma.property.findUnique({
      where: { houseNumber: data.houseNumber }
    });
    if (existingHouse) {
      throw new ApiError(400, "A property with this house number already exists");
    }

    const existingFile = await prisma.property.findUnique({
      where: { fileNumber: data.fileNumber }
    });
    if (existingFile) {
      throw new ApiError(400, "A property with this file number already exists");
    }

    // Default status
    let status = data.status || PropertyStatus.SUBMITTED;
    if (data.saveAsDraft) {
      status = PropertyStatus.DRAFT;
    }

    return prisma.property.create({
      data: {
        houseNumber: data.houseNumber,
        fileNumber: data.fileNumber,
        landSizeKare: data.landSizeKare,
        ownershipType: data.ownershipType,
        locationCategoryId: data.locationCategoryId,
        locationDescription: data.locationDescription,
        ownerId: ownerId as string,
        status,
      },
      include: {
        owner: true,
        locationCategory: true
      }
    });
  }

  async update(id: string, data: UpdatePropertyDto, currentUser: any) {
    const property = await this.findById(id, currentUser);

    // Business rules for editing
    if (currentUser.role === UserRole.USER) {
      if (property.status !== PropertyStatus.DRAFT && property.status !== PropertyStatus.REJECTED) {
        throw new ApiError(400, "You can only edit properties in DRAFT or REJECTED status");
      }
    }

    // Check unique constraints if numbers changed
    if (data.houseNumber && data.houseNumber !== property.houseNumber) {
      const existing = await prisma.property.findUnique({
        where: { houseNumber: data.houseNumber }
      });
      if (existing) throw new ApiError(400, "House number already exists");
    }

    if (data.fileNumber && data.fileNumber !== property.fileNumber) {
      const existing = await prisma.property.findUnique({
        where: { fileNumber: data.fileNumber }
      });
      if (existing) throw new ApiError(400, "File number already exists");
    }

    return prisma.property.update({
      where: { id },
      data: {
        houseNumber: data.houseNumber,
        fileNumber: data.fileNumber,
        landSizeKare: data.landSizeKare,
        ownershipType: data.ownershipType,
        locationCategoryId: data.locationCategoryId,
        locationDescription: data.locationDescription,
        status: data.status,
      },
      include: {
        owner: true,
        locationCategory: true
      }
    });
  }

  async submit(id: string, currentUser: any) {
    const property = await this.findById(id, currentUser);

    if (property.status !== PropertyStatus.DRAFT && property.status !== PropertyStatus.REJECTED) {
      throw new ApiError(400, "Only DRAFT or REJECTED properties can be submitted");
    }

    return prisma.property.update({
      where: { id },
      data: { status: PropertyStatus.SUBMITTED }
    });
  }

  async startReview(id: string, currentUser: any) {
    const property = await this.findById(id, currentUser);

    if (property.status !== PropertyStatus.SUBMITTED) {
      throw new ApiError(400, "Only SUBMITTED properties can be moved to UNDER_REVIEW");
    }

    return prisma.property.update({
      where: { id },
      data: { 
        status: PropertyStatus.UNDER_REVIEW,
        reviewedById: currentUser.id,
        reviewedAt: new Date()
      }
    });
  }

  async approve(id: string, currentUser: any) {
    const property = await this.findById(id, currentUser);

    if (property.status !== PropertyStatus.SUBMITTED && property.status !== PropertyStatus.UNDER_REVIEW) {
      throw new ApiError(400, "Only SUBMITTED or UNDER_REVIEW properties can be approved");
    }

    if (!property.locationCategoryId) {
      throw new ApiError(400, "Location category must be set before approval");
    }

    return prisma.property.update({
      where: { id },
      data: { 
        status: PropertyStatus.APPROVED,
        approvedById: currentUser.id,
        approvedAt: new Date(),
        rejectionReason: null
      }
    });
  }

  async reject(id: string, data: RejectPropertyDto, currentUser: any) {
    const property = await this.findById(id, currentUser);

    if (property.status !== PropertyStatus.SUBMITTED && property.status !== PropertyStatus.UNDER_REVIEW) {
      throw new ApiError(400, "Only SUBMITTED or UNDER_REVIEW properties can be rejected");
    }

    return prisma.property.update({
      where: { id },
      data: { 
        status: PropertyStatus.REJECTED,
        rejectionReason: data.rejectionReason,
        reviewedById: currentUser.id,
        reviewedAt: new Date()
      }
    });
  }

  async archive(id: string, currentUser: any) {
    await this.findById(id, currentUser);

    return prisma.property.update({
      where: { id },
      data: { status: PropertyStatus.ARCHIVED }
    });
  }
}

export const propertiesService = new PropertiesService();
