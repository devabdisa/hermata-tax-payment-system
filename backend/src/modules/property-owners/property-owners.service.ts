import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class PropertyOwnersService {
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
    return await prisma.houseOwnerProfile.create({
      data,
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
