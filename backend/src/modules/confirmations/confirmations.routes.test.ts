import request from 'supertest';
import app from '../../app';
import { UserRole, OwnershipType, PaymentMethod, PaymentStatus } from '@prisma/client';
import { createTestSession } from '../../tests/helpers/auth.helper';
import { prisma } from '../../config/db';

describe('Confirmations API Endpoints', () => {
  let adminAuthHeader: string;
  let paymentId: string;
  let confirmationId: string;

  beforeAll(async () => {
    const adminSession = await createTestSession(prisma, UserRole.ADMIN);
    adminAuthHeader = adminSession.authHeader;

    // Create a chain of entities to get to a verified payment
    const category = await prisma.locationCategory.create({
      data: { name: 'Conf Test Cat', code: `CAT-C-${Date.now()}` }
    });

    const userSession = await createTestSession(prisma, UserRole.USER);
    const owner = await prisma.houseOwnerProfile.create({
      data: { userId: userSession.user.id, fullName: 'Conf Test Owner', phone: '0911333444' }
    });

    const property = await prisma.property.create({
      data: {
        ownerId: owner.id,
        houseNumber: `H-C-${Date.now()}`,
        fileNumber: `F-C-${Date.now()}`,
        landSizeKare: 100,
        locationCategoryId: category.id,
        ownershipType: OwnershipType.LEASE,
        status: 'APPROVED'
      }
    });

    const taxRate = await prisma.taxRate.create({
      data: {
        taxYear: 2024,
        locationCategoryId: category.id,
        ratePerKare: 10.0,
        createdById: adminSession.user.id
      }
    });

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

    const payment = await prisma.payment.create({
      data: {
        assessmentId: assessment.id,
        amount: 1000,
        method: PaymentMethod.ONLINE,
        status: PaymentStatus.VERIFIED,
        paidAt: new Date()
      }
    });
    paymentId = payment.id;
  });

  afterAll(async () => {
    // Cleanup
    await prisma.kebeleConfirmation.deleteMany({});
    await prisma.payment.deleteMany({});
    await prisma.taxAssessment.deleteMany({});
    await prisma.taxRate.deleteMany({});
    await prisma.property.deleteMany({});
    await prisma.houseOwnerProfile.deleteMany({});
    await prisma.locationCategory.deleteMany({});
    await prisma.session.deleteMany({ where: { userId: { startsWith: 'test-' } } });
    await prisma.user.deleteMany({ where: { id: { startsWith: 'test-' } } });
  });

  describe('POST /api/v1/confirmations', () => {
    it('should create a new confirmation', async () => {
      const payload = {
        paymentId,
        note: 'Test Confirmation'
      };

      const res = await request(app)
        .post('/api/v1/confirmations')
        .set('Authorization', adminAuthHeader)
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      confirmationId = res.body.data.id;
    });
  });

  describe('GET /api/v1/confirmations', () => {
    it('should list confirmations', async () => {
      const res = await request(app)
        .get('/api/v1/confirmations')
        .set('Authorization', adminAuthHeader);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data.data)).toBe(true);
    });
  });
});
