import request from 'supertest';
import app from '../../app';
import { UserRole } from '@prisma/client';
import { createTestSession } from '../../tests/helpers/auth.helper';
import { prisma } from '../../config/db';

describe('Tax Rates API Endpoints', () => {
  let adminAuthHeader: string;
  let categoryId: string;
  let taxRateId: string;

  beforeEach(async () => {
    const adminSession = await createTestSession(prisma, UserRole.ADMIN);
    adminAuthHeader = adminSession.authHeader;

    // Create a location category for tax rates
    const category = await prisma.locationCategory.create({
      data: {
        name: `Tax Cat ${Date.now()}`,
        code: `TEST-TR-${Math.random().toString(36).substring(7)}`,
        isActive: true
      }
    });
    categoryId = category.id;

    // Create a base tax rate for tests that need an ID
    const taxRate = await prisma.taxRate.create({
      data: {
        taxYear: 2024,
        locationCategoryId: categoryId,
        ratePerKare: 10.0,
        createdById: adminSession.user.id
      }
    });
    taxRateId = taxRate.id;
  });

  afterAll(async () => {
    // Cleanup test data
    await prisma.taxRate.deleteMany({
      where: { locationCategory: { code: { startsWith: 'TEST-TR-' } } }
    });
    await prisma.locationCategory.deleteMany({
      where: { code: { startsWith: 'TEST-TR-' } }
    });
    await prisma.session.deleteMany({
      where: { userId: { startsWith: 'test-' } }
    });
    await prisma.user.deleteMany({
      where: { id: { startsWith: 'test-' } }
    });
  });

  describe('POST /api/v1/tax-rates', () => {
    it('should create a new tax rate', async () => {
      const payload = {
        taxYear: 2025,
        locationCategoryId: categoryId,
        ratePerKare: 15.5,
        note: 'New rate'
      };

      const res = await request(app)
        .post('/api/v1/tax-rates')
        .set('Authorization', adminAuthHeader)
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });
  });

  describe('GET /api/v1/tax-rates', () => {
    it('should list tax rates', async () => {
      const res = await request(app)
        .get('/api/v1/tax-rates')
        .set('Authorization', adminAuthHeader);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('GET /api/v1/tax-rates/:id', () => {
    it('should return a specific tax rate', async () => {
      const res = await request(app)
        .get(`/api/v1/tax-rates/${taxRateId}`)
        .set('Authorization', adminAuthHeader);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(taxRateId);
    });
  });

  describe('PATCH /api/v1/tax-rates/:id', () => {
    it('should update a tax rate', async () => {
      const res = await request(app)
        .patch(`/api/v1/tax-rates/${taxRateId}`)
        .set('Authorization', adminAuthHeader)
        .send({ ratePerKare: 20.0 });

      expect(res.status).toBe(200);
      expect(Number(res.body.data.ratePerKare)).toBe(20.0);
    });
  });
});
