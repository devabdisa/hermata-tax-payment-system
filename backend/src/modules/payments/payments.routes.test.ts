import request from 'supertest';
import app from '../../app';
import { UserRole, OwnershipType, PaymentMethod } from '@prisma/client';
import { createTestSession } from '../../tests/helpers/auth.helper';
import { prisma } from '../../config/db';

// Mock Chapa service BEFORE importing other things if possible, but here it's fine
jest.mock('./chapa.service', () => {
  return {
    assertChapaConfigured: jest.fn(),
    chapaInitializePayment: jest.fn().mockImplementation((params) => Promise.resolve({
      checkoutUrl: 'https://test.chapa.co/checkout',
      txRef: params.txRef || 'TEST-TX-REF'
    })),
    chapaVerifyTransaction: jest.fn().mockResolvedValue({
      success: true,
      status: 'success',
      txRef: 'TEST-TX-REF'
    }),
    generateTxRef: jest.fn().mockReturnValue('TEST-TX-REF-123')
  };
});

describe('Payments API Endpoints', () => {
  let adminAuthHeader: string;
  let assessmentId: string;
  let paymentId: string;
  let taxRateId: string;
  let propertyId: string;
  let ownerId: string;
  let categoryId: string;

  beforeAll(async () => {
    const adminSession = await createTestSession(prisma, UserRole.ADMIN);
    adminAuthHeader = adminSession.authHeader;

    // Create a chain of entities
    const category = await prisma.locationCategory.create({
      data: { name: 'Payment Test Cat', code: `CAT-P-${Date.now()}` }
    });
    categoryId = category.id;

    const userSession = await createTestSession(prisma, UserRole.USER);
    const owner = await prisma.houseOwnerProfile.create({
      data: { userId: userSession.user.id, fullName: 'Payment Test Owner', phone: '0911222333' }
    });
    ownerId = owner.id;

    const property = await prisma.property.create({
      data: {
        ownerId: owner.id,
        houseNumber: `H-P-${Date.now()}`,
        fileNumber: `F-P-${Date.now()}`,
        landSizeKare: 100,
        locationCategoryId: category.id,
        ownershipType: OwnershipType.LEASE,
        status: 'APPROVED'
      }
    });
    propertyId = property.id;

    const taxRate = await prisma.taxRate.create({
      data: {
        taxYear: 2024,
        locationCategoryId: category.id,
        ratePerKare: 10.0,
        createdById: adminSession.user.id
      }
    });
    taxRateId = taxRate.id;

    const assessment = await prisma.taxAssessment.create({
      data: {
        propertyId: property.id,
        taxRateId: taxRate.id,
        taxYear: 2024,
        landSizeKare: 100,
        ratePerKare: 10.0,
        baseAmount: 1000,
        totalAmount: 1000,
        status: 'ISSUED'
      }
    });
    assessmentId = assessment.id;
  });

  afterAll(async () => {
    await prisma.kebeleConfirmation.deleteMany({ where: { paymentId } });
    await prisma.payment.deleteMany({ where: { assessmentId } });
    await prisma.taxAssessment.deleteMany({ where: { id: assessmentId } });
    await prisma.taxRate.deleteMany({ where: { id: taxRateId } });
    await prisma.property.deleteMany({ where: { id: propertyId } });
    await prisma.houseOwnerProfile.deleteMany({ where: { id: ownerId } });
    await prisma.locationCategory.deleteMany({ where: { id: categoryId } });
    await prisma.session.deleteMany({ where: { userId: { startsWith: 'test-' } } });
    await prisma.user.deleteMany({ where: { id: { startsWith: 'test-' } } });
  });

  describe('POST /api/v1/payments/chapa/initiate', () => {
    it('should initiate a Chapa payment', async () => {
      const payload = {
        assessmentId,
        amount: 1000,
        email: 'payer@example.com',
        firstName: 'Test',
        lastName: 'Payer',
        phone: '0911223344'
      };

      const res = await request(app)
        .post('/api/v1/payments/chapa/initiate')
        .set('Authorization', adminAuthHeader)
        .send(payload);

      if (res.status !== 201) {
        console.log('POST /payments/chapa/initiate ERROR:', JSON.stringify(res.body, null, 2));
      }
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      paymentId = res.body.data.payment.id;
    });
  });

  describe('GET /api/v1/payments', () => {
    it('should list payments', async () => {
      const res = await request(app)
        .get('/api/v1/payments')
        .set('Authorization', adminAuthHeader);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});
