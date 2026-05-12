import { Prisma, DocumentStatus, UserRole } from "@prisma/client";
import { prisma } from "../../config/db";
import { 
  UploadDocumentDto, 
  UpdateDocumentDto, 
  DocumentQueryDto,
  RejectDocumentDto 
} from "./documents.types";
import { ApiError } from "../../utils/api-error";

export class DocumentsService {
  async findAll(query: DocumentQueryDto, currentUser: any) {
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 10);
    const skip = (page - 1) * limit;

    const where: Prisma.PropertyDocumentWhereInput = {};

    // Role-based access control
    if (currentUser.role === UserRole.USER || query.mine === true) {
      where.property = {
        owner: { userId: currentUser.id }
      };
    }

    if (query.propertyId) {
      where.propertyId = query.propertyId;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.uploadedById) {
      where.uploadedById = query.uploadedById;
    }

    if (query.reviewedById) {
      where.reviewedById = query.reviewedById;
    }

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { fileName: { contains: query.search, mode: 'insensitive' } },
        { documentType: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const orderBy: Prisma.PropertyDocumentOrderByWithRelationInput = {};
    if (query.sortBy) {
      orderBy[query.sortBy as keyof Prisma.PropertyDocumentOrderByWithRelationInput] = query.sortOrder || "desc";
    } else {
      orderBy.createdAt = "desc";
    }

    const [total, data] = await prisma.$transaction([
      prisma.propertyDocument.count({ where }),
      prisma.propertyDocument.findMany({
        where,
        include: {
          property: {
            select: { id: true, houseNumber: true, fileNumber: true, status: true }
          },
          reviewedBy: { select: { id: true, name: true, email: true } },
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
    const document = await prisma.propertyDocument.findUnique({
      where: { id },
      include: {
        property: {
          include: { owner: true }
        },
        reviewedBy: { select: { id: true, name: true, email: true } },
      }
    });

    if (!document) {
      throw new ApiError(404, "Document not found");
    }

    // Role-based access control
    if (currentUser.role === UserRole.USER) {
      if (document.property.owner.userId !== currentUser.id) {
        throw new ApiError(403, "You do not have permission to view this document");
      }
    }

    return document;
  }

  async upload(data: UploadDocumentDto, file: any, currentUser: any) {
    if (!file || !file.storageInfo) {
      throw new ApiError(400, "File is required");
    }

    // 1. Check property
    const property = await prisma.property.findUnique({
      where: { id: data.propertyId },
      include: { owner: true }
    });

    if (!property) {
      throw new ApiError(404, "Property not found");
    }

    // 2. Check ownership if USER
    if (currentUser.role === UserRole.USER) {
      if (property.owner.userId !== currentUser.id) {
        throw new ApiError(403, "You can only upload documents for your own property");
      }
    }

    // 3. Status checks
    if (property.status === 'ARCHIVED') {
      throw new ApiError(400, "Cannot upload documents for archived property");
    }

    const fileInfo = file.storageInfo; 

    return prisma.propertyDocument.create({
      data: {
        propertyId: data.propertyId,
        uploadedById: currentUser.id,
        title: data.title,
        fileUrl: fileInfo.url,
        fileName: file.originalname,
        mimeType: file.mimetype,
        fileSize: file.size,
        documentType: data.documentType,
        note: data.note,
        status: DocumentStatus.PENDING,
      }
    });
  }

  async update(id: string, data: UpdateDocumentDto, currentUser: any) {
    const document = await this.findById(id, currentUser);

    if (currentUser.role === UserRole.USER) {
      if (document.status === DocumentStatus.APPROVED) {
        throw new ApiError(400, "Cannot update an approved document");
      }
    }

    return prisma.propertyDocument.update({
      where: { id },
      data: {
        title: data.title,
        documentType: data.documentType,
        note: data.note,
      }
    });
  }

  async approve(id: string, currentUser: any) {
    await this.findById(id, currentUser);

    return prisma.propertyDocument.update({
      where: { id },
      data: {
        status: DocumentStatus.APPROVED,
        reviewedById: currentUser.id,
        reviewedAt: new Date(),
        rejectionReason: null
      }
    });
  }

  async reject(id: string, data: RejectDocumentDto, currentUser: any) {
    await this.findById(id, currentUser);

    return prisma.propertyDocument.update({
      where: { id },
      data: {
        status: DocumentStatus.REJECTED,
        rejectionReason: data.rejectionReason,
        reviewedById: currentUser.id,
        reviewedAt: new Date()
      }
    });
  }

  async replace(id: string, file: any, currentUser: any) {
    if (!file || !file.storageInfo) {
      throw new ApiError(400, "Replacement file is required");
    }

    const document = await this.findById(id, currentUser);

    // USER can only replace rejected documents
    if (currentUser.role === UserRole.USER) {
      if (document.status !== DocumentStatus.REJECTED) {
        throw new ApiError(400, "You can only replace rejected documents");
      }
    }

    const fileInfo = file.storageInfo;

    return prisma.propertyDocument.update({
      where: { id },
      data: {
        fileUrl: fileInfo.url,
        fileName: file.originalname,
        mimeType: file.mimetype,
        fileSize: file.size,
        status: DocumentStatus.PENDING,
        rejectionReason: null,
      }
    });
  }

  async delete(id: string, currentUser: any) {
    const document = await this.findById(id, currentUser);

    if (currentUser.role === UserRole.USER) {
      if (document.status === DocumentStatus.APPROVED) {
        throw new ApiError(400, "Cannot delete an approved document");
      }
    }

    return prisma.propertyDocument.delete({
      where: { id }
    });
  }
}

export const documentsService = new DocumentsService();
