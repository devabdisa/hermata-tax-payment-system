import request from 'supertest';
import app from '../../app';
import { UserRole, OwnershipType } from '@prisma/client';
import { createTestSession } from '../../tests/helpers/auth.helper';
import { prisma } from '../../config/db';

describe('Assessments API Endpoints', () => {
  let adminAuthHeader: string;
  let propertyId: string;
  let taxRateId: string;
  let assessmentId: string;

  beforeAll(async () => {
    const adminSession = await createTestSession(prisma, UserRole.ADMIN);
    adminAuthHeader = adminSession.authHeader;

    // Create a category
    const category = await prisma.locationCategory.create({
      data: { name: 'Assessment Test Cat', code: `CAT-${Date.now()}` }
    });

    // Create an owner
    const userSession = await createTestSession(prisma, UserRole.USER);
    const owner = await prisma.houseOwnerProfile.create({
      data: { userId: userSession.user.id, fullName: 'Assessment Test Owner', phone: '0911000111' }
    });

    // Create a property and manually approve it to satisfy business rules
    const property = await prisma.property.create({
      data: {
        ownerId: owner.id,
        houseNumber: `H-${Date.now()}`,
        fileNumber: `F-${Date.now()}`,
        landSizeKare: 100,
        locationCategoryId: category.id,
        ownershipType: OwnershipType.LEASE,
        status: 'APPROVED' // Property must be APPROVED for assessment
      }
    });
    propertyId = property.id;

    // Create a tax rate
    const taxRate = await prisma.taxRate.create({
      data: {
        taxYear: 2024,
        locationCategoryId: category.id,
        ratePerKare: 10.0,
        createdById: adminSession.user.id
      }
    });
    taxRateId = taxRate.id;
  });

  afterAll(async () => {
    // Cleanup in correct order to avoid foreign key violations
    await prisma.taxAssessment.deleteMany({});
    await prisma.taxRate.deleteMany({});
    await prisma.property.deleteMany({});
    await prisma.houseOwnerProfile.deleteMany({});
    await prisma.locationCategory.deleteMany({});
    await prisma.session.deleteMany({ where: { userId: { startsWith: 'test-' } } });
    await prisma.user.deleteMany({ where: { id: { startsWith: 'test-' } } });
  });

  describe('POST /api/v1/assessments', () => {
    it('should create a new tax assessment', async () => {
      const payload = {
        propertyId,
        taxYear: 2024,
        note: 'Test Assessment'
      };

      const res = await request(app)
        .post('/api/v1/assessments')
        .set('Authorization', adminAuthHeader)
        .send(payload);

      if (res.status !== 201) {
        console.log('POST /assessments 400 ERROR:', JSON.stringify(res.body, null, 2));
      }
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      assessmentId = res.body.data.id;
    });
  });

  describe('GET /api/v1/assessments', () => {
    it('should list assessments', async () => {
      const res = await request(app)
        .get('/api/v1/assessments')
        .set('Authorization', adminAuthHeader);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});
