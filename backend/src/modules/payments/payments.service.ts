import { Prisma, PaymentMethod, PaymentStatus, AssessmentStatus, UserRole } from "@prisma/client";
import { prisma } from "../../config/db";
import {
  PaymentQueryDto,
  CreateSinqeeReceiptDto,
  RejectPaymentDto,
  CancelPaymentDto,
  InitiateChapaPaymentDto,
} from "./payments.types";
import { ApiError } from "../../utils/api-error";
import {
  assertChapaConfigured,
  chapaInitializePayment,
  chapaVerifyTransaction,
  generateTxRef,
} from "./chapa.service";

// -- Shared include for payment queries --
const PAYMENT_INCLUDE = {
  assessment: {
    include: {
      property: {
        include: {
          owner: true,
          locationCategory: true,
        },
      },
    },
  },
  verifiedBy: { select: { id: true, name: true, email: true } },
} as const;

export class PaymentsService {
  // ----------------------------------------------------------------
  // HELPERS
  // ----------------------------------------------------------------
  private assertCanViewPayment(payment: any, currentUser: any) {
    if (currentUser.role === UserRole.USER) {
      const ownerId = payment.assessment?.property?.owner?.userId;
      if (ownerId !== currentUser.id) {
        throw new ApiError(403, "You do not have permission to view this payment");
      }
    }
  }

  private async assertAssessmentPayable(assessmentId: string) {
    const assessment = await prisma.taxAssessment.findUnique({
      where: { id: assessmentId },
      include: { property: { include: { owner: true } } },
    });
    if (!assessment) throw new ApiError(404, "Assessment not found");
    if (assessment.status !== AssessmentStatus.ISSUED) {
      throw new ApiError(400, `Only ISSUED assessments can be paid. Current status: ${assessment.status}`);
    }
    return assessment;
  }

  private async assertNoVerifiedPayment(assessmentId: string) {
    const existing = await prisma.payment.findFirst({
      where: { assessmentId, status: PaymentStatus.VERIFIED },
    });
    if (existing) {
      throw new ApiError(409, "This assessment already has a verified payment");
    }
  }

  private assertAmountMatchesAssessment(amount: number, assessment: any) {
    const expected = Number(assessment.totalAmount);
    // Allow 1 cent tolerance for floating point
    if (Math.abs(amount - expected) > 0.01) {
      throw new ApiError(
        400,
        `Payment amount (${amount}) does not match assessment total (${expected}). Full payment is required.`
      );
    }
  }

  private async markPaymentVerifiedAndAssessmentPaid(
    paymentId: string,
    verifierId?: string,
    chapaPayload?: any
  ) {
    return prisma.$transaction([
      prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: PaymentStatus.VERIFIED,
          verifiedAt: new Date(),
          verifiedById: verifierId || null,
          chapaPayload: chapaPayload || undefined,
          chapaStatus: chapaPayload ? "success" : undefined,
          chapaTransactionId: chapaPayload?.transactionId || undefined,
        },
        include: PAYMENT_INCLUDE,
      }),
      prisma.taxAssessment.update({
        where: { id: (await prisma.payment.findUnique({ where: { id: paymentId } }))!.assessmentId },
        data: { status: AssessmentStatus.PAID },
      }),
    ]);
  }

  // ----------------------------------------------------------------
  // LIST PAYMENTS
  // ----------------------------------------------------------------
  async findAll(query: PaymentQueryDto, currentUser: any) {
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 10);
    const skip = (page - 1) * limit;

    const where: Prisma.PaymentWhereInput = {};

    if (currentUser.role === UserRole.USER || query.mine === true) {
      where.assessment = {
        property: { owner: { userId: currentUser.id } },
      };
    }

    if (query.status) where.status = query.status;
    if (query.method) where.method = query.method;
    if (query.assessmentId) where.assessmentId = query.assessmentId;
    if (query.payerId) where.payerId = query.payerId;

    if (query.propertyId) {
      where.assessment = { propertyId: query.propertyId };
    }

    if (query.taxYear) {
      where.assessment = { ...((where.assessment as any) || {}), taxYear: query.taxYear };
    }

    if (query.search) {
      where.OR = [
        { referenceNumber: { contains: query.search, mode: "insensitive" } },
        { txRef: { contains: query.search, mode: "insensitive" } },
        { assessment: { property: { houseNumber: { contains: query.search, mode: "insensitive" } } } },
        { assessment: { property: { fileNumber: { contains: query.search, mode: "insensitive" } } } },
        { assessment: { property: { owner: { fullName: { contains: query.search, mode: "insensitive" } } } } },
      ];
    }

    const orderBy: Prisma.PaymentOrderByWithRelationInput =
      query.sortBy
        ? { [query.sortBy]: query.sortOrder || "desc" }
        : { createdAt: "desc" };

    const [total, data] = await prisma.$transaction([
      prisma.payment.count({ where }),
      prisma.payment.findMany({
        where,
        include: PAYMENT_INCLUDE,
        orderBy,
        skip,
        take: limit,
      }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // ----------------------------------------------------------------
  // GET ONE PAYMENT
  // ----------------------------------------------------------------
  async findById(id: string, currentUser: any) {
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: PAYMENT_INCLUDE,
    });
    if (!payment) throw new ApiError(404, "Payment not found");
    this.assertCanViewPayment(payment, currentUser);
    return payment;
  }

  // ----------------------------------------------------------------
  // CREATE SINQEE BANK RECEIPT PAYMENT
  // ----------------------------------------------------------------
  async createSinqeeReceiptPayment(
    data: CreateSinqeeReceiptDto,
    file: any,
    currentUser: any
  ) {
    if (!file || !file.storageInfo) {
      throw new ApiError(400, "Receipt file is required for Sinqee Bank payment");
    }

    const assessment = await this.assertAssessmentPayable(data.assessmentId);
    await this.assertNoVerifiedPayment(data.assessmentId);
    this.assertAmountMatchesAssessment(data.amount, assessment);

    const fileInfo = file.storageInfo;
    const payerId = currentUser.id;

    return prisma.payment.create({
      data: {
        assessmentId: data.assessmentId,
        payerId,
        method: PaymentMethod.SINQEE_BANK,
        status: PaymentStatus.UNDER_REVIEW,
        amount: new Prisma.Decimal(data.amount),
        paidAt: new Date(data.paidAt),
        referenceNumber: data.referenceNumber,
        bankName: "Sinqee Bank",
        bankBranch: data.bankBranch,
        receiptFileUrl: fileInfo.url,
        receiptFileName: file.originalname,
        note: data.note,
      },
      include: PAYMENT_INCLUDE,
    });
  }

  // ----------------------------------------------------------------
  // VERIFY PAYMENT (manual - Sinqee Bank)
  // ----------------------------------------------------------------
  async verifyPayment(id: string, currentUser: any) {
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: { assessment: true },
    });
    if (!payment) throw new ApiError(404, "Payment not found");

    if (
      payment.status !== PaymentStatus.UNDER_REVIEW &&
      payment.status !== PaymentStatus.PENDING
    ) {
      throw new ApiError(
        400,
        `Payment cannot be verified. Current status: ${payment.status}`
      );
    }

    await this.assertNoVerifiedPayment(payment.assessmentId);

    const [updatedPayment] = await this.markPaymentVerifiedAndAssessmentPaid(
      id,
      currentUser.id
    );
    return updatedPayment;
  }

  // ----------------------------------------------------------------
  // REJECT PAYMENT
  // ----------------------------------------------------------------
  async rejectPayment(id: string, data: RejectPaymentDto, currentUser: any) {
    const payment = await prisma.payment.findUnique({ where: { id } });
    if (!payment) throw new ApiError(404, "Payment not found");

    if (
      payment.status !== PaymentStatus.UNDER_REVIEW &&
      payment.status !== PaymentStatus.PENDING
    ) {
      throw new ApiError(400, `Payment cannot be rejected. Current status: ${payment.status}`);
    }

    return prisma.payment.update({
      where: { id },
      data: {
        status: PaymentStatus.REJECTED,
        rejectionReason: data.rejectionReason,
      },
      include: PAYMENT_INCLUDE,
    });
  }

  // ----------------------------------------------------------------
  // CANCEL PAYMENT
  // ----------------------------------------------------------------
  async cancelPayment(id: string, data: CancelPaymentDto, currentUser: any) {
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: { assessment: { include: { property: { include: { owner: true } } } } },
    });
    if (!payment) throw new ApiError(404, "Payment not found");

    if (payment.status === PaymentStatus.VERIFIED) {
      throw new ApiError(400, "Verified payments cannot be cancelled");
    }

    if (payment.status === PaymentStatus.CANCELLED) {
      throw new ApiError(400, "Payment is already cancelled");
    }

    // USER can only cancel their own payment
    if (currentUser.role === UserRole.USER) {
      const ownerId = payment.assessment?.property?.owner?.userId;
      if (ownerId !== currentUser.id) {
        throw new ApiError(403, "You cannot cancel this payment");
      }
    }

    return prisma.payment.update({
      where: { id },
      data: {
        status: PaymentStatus.CANCELLED,
        cancellationReason: data.cancellationReason,
      },
      include: PAYMENT_INCLUDE,
    });
  }

  // ----------------------------------------------------------------
  // INITIATE CHAPA PAYMENT
  // ----------------------------------------------------------------
  async initiateChapaPayment(data: InitiateChapaPaymentDto, currentUser: any) {
    assertChapaConfigured();

    const assessment = await this.assertAssessmentPayable(data.assessmentId);
    await this.assertNoVerifiedPayment(data.assessmentId);

    const amount = Number(assessment.totalAmount);
    const txRef = generateTxRef(data.assessmentId);
    const email = currentUser.email || "taxpayer@kebele.gov.et";
    const returnUrl =
      data.returnUrl || process.env.CHAPA_RETURN_URL || "http://localhost:3000/payments";
    const callbackUrl =
      data.callbackUrl ||
      process.env.CHAPA_CALLBACK_URL ||
      "http://localhost:5000/api/v1/payments/chapa/webhook";

    const chapaResult = await chapaInitializePayment({
      amount,
      email,
      txRef,
      callbackUrl,
      returnUrl,
      title: `Kebele Tax – House #${assessment.property?.houseNumber || ""}`,
      description: `Tax Year ${assessment.taxYear}`,
    });

    const payment = await prisma.payment.create({
      data: {
        assessmentId: data.assessmentId,
        payerId: currentUser.id,
        method: PaymentMethod.CHAPA,
        status: PaymentStatus.PENDING,
        amount: new Prisma.Decimal(amount),
        txRef,
        chapaCheckoutUrl: chapaResult.checkoutUrl,
        returnUrl,
        callbackUrl,
      },
      include: PAYMENT_INCLUDE,
    });

    return { payment, checkoutUrl: chapaResult.checkoutUrl, txRef };
  }

  // ----------------------------------------------------------------
  // VERIFY CHAPA TRANSACTION
  // ----------------------------------------------------------------
  async verifyChapaPayment(txRef: string, currentUser?: any) {
    assertChapaConfigured();

    const payment = await prisma.payment.findUnique({
      where: { txRef },
      include: { assessment: true },
    });

    if (!payment) throw new ApiError(404, "Payment not found for this txRef");

    if (payment.status === PaymentStatus.VERIFIED) {
      return { payment, alreadyVerified: true };
    }

    const verifyResult = await chapaVerifyTransaction(txRef);

    if (verifyResult.success) {
      await this.assertNoVerifiedPayment(payment.assessmentId);
      const [updatedPayment] = await this.markPaymentVerifiedAndAssessmentPaid(
        payment.id,
        currentUser?.id,
        verifyResult
      );
      return { payment: updatedPayment, alreadyVerified: false };
    } else {
      // Update chapa status without marking as verified
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          chapaStatus: verifyResult.status,
          chapaPayload: verifyResult.raw as any,
        },
      });
      throw new ApiError(400, `Chapa transaction not successful. Status: ${verifyResult.status}`);
    }
  }

  // ----------------------------------------------------------------
  // CHAPA WEBHOOK
  // ----------------------------------------------------------------
  async handleChapaWebhook(payload: any) {
    // TODO: Implement Chapa webhook signature verification when documentation is available.
    // For now, we extract the txRef and verify via the API to avoid trusting the webhook alone.
    const txRef = payload?.tx_ref || payload?.trx_ref;

    if (!txRef) {
      // Ignore malformed webhook
      return { received: true, message: "No txRef in payload" };
    }

    try {
      assertChapaConfigured();
      await this.verifyChapaPayment(txRef);
      return { received: true, verified: true };
    } catch (err: any) {
      // Do not throw – always return 200 to Chapa
      return { received: true, error: err.message };
    }
  }
}

export const paymentsService = new PaymentsService();
