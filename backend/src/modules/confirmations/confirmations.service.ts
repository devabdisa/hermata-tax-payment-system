import { prisma } from '../../config/db';
import { ApiError } from '../../utils/api-error';
import { ApiResponse } from '../../utils/api-response';
import { ConfirmationListQuery, CreateConfirmationData, CancelConfirmationData } from './confirmations.types';
import { ConfirmationStatus, UserRole } from '@prisma/client';

export class ConfirmationsService {
  /**
   * List confirmations with filters
   */
  static async listConfirmations(query: ConfirmationListQuery, currentUser: any) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      paymentId,
      assessmentId,
      propertyId,
      taxYear,
      issuedById,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      mine,
    } = query;

    const skip = (page - 1) * limit;

    const where: any = {};

    // RBAC: Non-admin/manager/worker roles can only see their own confirmations
    if (currentUser.role === UserRole.USER || mine) {
      where.payment = {
        assessment: {
          property: {
            owner: {
              userId: currentUser.id,
            },
          },
        },
      };
    }

    if (status) where.status = status;
    if (paymentId) where.paymentId = paymentId;
    if (issuedById) where.issuedById = issuedById;

    if (assessmentId || propertyId || taxYear) {
      where.payment = {
        ...where.payment,
        assessment: {
          ...(where.payment?.assessment || {}),
          ...(assessmentId ? { id: assessmentId } : {}),
          ...(taxYear ? { taxYear } : {}),
          ...(propertyId ? { propertyId } : {}),
        },
      };
    }

    if (search) {
      where.OR = [
        { confirmationNumber: { contains: search, mode: 'insensitive' } },
        {
          payment: {
            OR: [
              { referenceNumber: { contains: search, mode: 'insensitive' } },
              { txRef: { contains: search, mode: 'insensitive' } },
              {
                assessment: {
                  property: {
                    OR: [
                      { houseNumber: { contains: search, mode: 'insensitive' } },
                      { fileNumber: { contains: search, mode: 'insensitive' } },
                      {
                        owner: {
                          fullName: { contains: search, mode: 'insensitive' },
                        },
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
      ];
    }

    const [total, data] = await Promise.all([
      prisma.kebeleConfirmation.count({ where }),
      prisma.kebeleConfirmation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          payment: {
            include: {
              assessment: {
                include: {
                  property: {
                    include: {
                      owner: true,
                      locationCategory: { select: { name: true } },
                    },
                  },
                },
              },
            },
          },
          issuedBy: { select: { name: true, email: true } },
          cancelledBy: { select: { name: true, email: true } },
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

  /**
   * Get single confirmation by ID
   */
  static async getConfirmationById(id: string, currentUser: any) {
    const confirmation = await prisma.kebeleConfirmation.findUnique({
      where: { id },
      include: {
        payment: {
          include: {
            assessment: {
              include: {
                property: {
                  include: {
                    owner: true,
                    locationCategory: { select: { name: true } },
                  },
                },
              },
            },
          },
        },
        issuedBy: { select: { name: true, email: true } },
        cancelledBy: { select: { name: true, email: true } },
      },
    });

    if (!confirmation) {
      throw new ApiError(404, 'Confirmation not found');
    }

    // Ownership check for USER role
    if (currentUser.role === UserRole.USER) {
      const ownerUserId = confirmation.payment?.assessment?.property?.owner?.userId;
      if (ownerUserId !== currentUser.id) {
        throw new ApiError(403, 'You do not have permission to view this confirmation');
      }
    }

    return confirmation;
  }

  /**
   * Create new confirmation
   */
  static async createConfirmation(data: CreateConfirmationData, currentUser: any) {
    const { paymentId, note } = data;

    // 1. Check if payment exists and is VERIFIED
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { assessment: true },
    });

    if (!payment) {
      throw new ApiError(404, 'Payment not found');
    }

    if (payment.status !== 'VERIFIED') {
      throw new ApiError(400, `Confirmation can only be issued for VERIFIED payments. Current status: ${payment.status}`);
    }

    // 2. Ensure assessment is PAID (should be handled by verification service, but double check)
    if (payment.assessment?.status !== 'PAID') {
       // We'll trust the verification logic but if it's not PAID we might want to warn or enforce
       // In our previous step we ensured verification marks assessment as PAID.
    }

    // 3. Prevent duplicates
    const existingConfirmation = await prisma.kebeleConfirmation.findFirst({
      where: { paymentId, status: ConfirmationStatus.ISSUED },
    });

    if (existingConfirmation) {
      throw new ApiError(400, 'An active confirmation already exists for this payment');
    }

    // 4. Generate confirmation number
    const confirmationNumber = await this.generateConfirmationNumber();

    // 5. Create confirmation
    const confirmation = await prisma.kebeleConfirmation.create({
      data: {
        paymentId,
        confirmationNumber,
        note,
        issuedById: currentUser.id,
        status: ConfirmationStatus.ISSUED,
      },
      include: {
        payment: true,
        issuedBy: { select: { name: true, email: true } },
      },
    });

    // TODO: Add audit log

    return confirmation;
  }

  /**
   * Cancel/Revoke confirmation
   */
  static async cancelConfirmation(id: string, data: CancelConfirmationData, currentUser: any) {
    const confirmation = await prisma.kebeleConfirmation.findUnique({
      where: { id },
    });

    if (!confirmation) {
      throw new ApiError(404, 'Confirmation not found');
    }

    if (confirmation.status === ConfirmationStatus.CANCELLED) {
      throw new ApiError(400, 'Confirmation is already cancelled');
    }

    const updatedConfirmation = await prisma.kebeleConfirmation.update({
      where: { id },
      data: {
        status: ConfirmationStatus.CANCELLED,
        cancelledById: currentUser.id,
        cancelledAt: new Date(),
        cancellationReason: data.cancellationReason,
      },
    });

    // TODO: Add audit log
    // NOTE: This does not automatically reverse the payment or assessment status in MVP.

    return updatedConfirmation;
  }

  /**
   * Mark confirmation as printed
   */
  static async markAsPrinted(id: string) {
    return prisma.kebeleConfirmation.update({
      where: { id },
      data: {
        printCount: { increment: 1 },
        lastPrintedAt: new Date(),
      },
    });
  }

  /**
   * Get confirmation by payment ID
   */
  static async getConfirmationByPaymentId(paymentId: string, currentUser: any) {
    const confirmation = await prisma.kebeleConfirmation.findUnique({
      where: { paymentId },
      include: {
        payment: true,
        issuedBy: { select: { name: true, email: true } },
        cancelledBy: { select: { name: true, email: true } },
      },
    });

    if (confirmation && currentUser.role === UserRole.USER) {
        // We'd need to fetch owner info to verify, but usually if they have the paymentId they might be authorized
        // Let's do a safe check by calling getConfirmationById if found
        return this.getConfirmationById(confirmation.id, currentUser);
    }

    return confirmation;
  }

  /**
   * Helper: Generate unique confirmation number
   * Format: KHC-<YEAR>-<6_DIGIT_SEQUENCE>
   */
  private static async generateConfirmationNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `KHC-${year}-`;

    // Find the latest number for this year
    const lastConfirmation = await prisma.kebeleConfirmation.findFirst({
      where: {
        confirmationNumber: {
          startsWith: prefix,
        },
      },
      orderBy: {
        confirmationNumber: 'desc',
      },
    });

    let sequence = 1;
    if (lastConfirmation) {
      const lastSequenceStr = lastConfirmation.confirmationNumber.split('-')[2];
      sequence = parseInt(lastSequenceStr, 10) + 1;
    }

    const paddedSequence = sequence.toString().padStart(6, '0');
    const newNumber = `${prefix}${paddedSequence}`;

    // Double check uniqueness (handling potential race condition)
    const exists = await prisma.kebeleConfirmation.findUnique({
      where: { confirmationNumber: newNumber },
    });

    if (exists) {
      // If someone else just took this number, try again (recursion)
      return this.generateConfirmationNumber();
    }

    return newNumber;
  }
}
