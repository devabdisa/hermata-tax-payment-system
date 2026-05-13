import { prisma } from "../../config/db";

export class PropertyOwnersService {
  static async getMyOwnerProfile(userId: string) {
    return prisma.houseOwnerProfile.findUnique({
      where: { userId },
      include: {
        user: true,
        properties: {
          include: { locationCategory: true },
        },
      },
    });
  }

  static async listOwners(filters: { search?: string }) {
    const where: any = {};

    if (filters.search) {
      where.OR = [
        { fullName: { contains: filters.search, mode: 'insensitive' } },
        { phone: { contains: filters.search, mode: 'insensitive' } },
        { nationalId: { contains: filters.search, mode: 'insensitive' } },
        { kebeleIdNumber: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return await prisma.houseOwnerProfile.findMany({
      where,
      orderBy: { fullName: 'asc' },
      include: {
        _count: {
          select: {
            properties: true,
          },
        },
      },
    });
  }

  static async getOwnerById(id: string) {
    return await prisma.houseOwnerProfile.findUnique({
      where: { id },
      include: {
        user: true,
        properties: {
          include: {
            locationCategory: true,
          }
        },
      },
    });
  }

  static async createOwner(data: any) {
    if (!data.userId) {
      throw new Error("A linked user account is required to create an owner profile");
    }
    return await prisma.houseOwnerProfile.create({
      data,
    });
  }

  static async upsertMyOwnerProfile(userId: string, data: any) {
    return prisma.houseOwnerProfile.upsert({
      where: { userId },
      create: {
        userId,
        ...data,
      },
      update: data,
    });
  }

  static async updateOwner(id: string, data: any) {
    return await prisma.houseOwnerProfile.update({
      where: { id },
      data,
    });
  }

  static async deleteOwner(id: string) {
    // Check if owner has properties
    const propertyCount = await prisma.property.count({ where: { ownerId: id } });
    if (propertyCount > 0) {
      throw new Error("Cannot delete owner with registered properties");
    }
    
    return await prisma.houseOwnerProfile.delete({
      where: { id },
    });
  }
}
