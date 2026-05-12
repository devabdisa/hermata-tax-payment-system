import { PrismaClient, UserRole, UserStatus } from "@prisma/client";

const prisma = new PrismaClient();

export class UsersService {
  static async listUsers(filters: { role?: UserRole; status?: UserStatus; search?: string }) {
    const where: any = {};

    if (filters.role) where.role = filters.role;
    if (filters.status) where.status = filters.status;
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return await prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            issuedAssessments: true,
            verifiedPayments: true,
          },
        },
      },
    });
  }

  static async getUserById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        ownerProfile: true,
      },
    });
  }

  static async createUser(data: any) {
    return await prisma.user.create({
      data,
    });
  }

  static async updateUser(id: string, data: any) {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  static async deleteUser(id: string) {
    // Check if user has dependencies (assessments, etc.)
    // For now, simple soft-delete or just error if hard delete fails
    return await prisma.user.delete({
      where: { id },
    });
  }
}
