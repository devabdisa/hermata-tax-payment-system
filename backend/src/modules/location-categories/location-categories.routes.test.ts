import request from 'supertest';
import app from '../../app';
import { UserRole } from '@prisma/client';
import { createTestSession } from '../../tests/helpers/auth.helper';
import { prisma } from '../../config/db';

describe('Location Categories API Endpoints', () => {
  let adminAuthHeader: string;
  let userAuthHeader: string;
  let categoryId: string;

  beforeAll(async () => {
    const adminSession = await createTestSession(prisma, UserRole.ADMIN);
    adminAuthHeader = adminSession.authHeader;

    const userSession = await createTestSession(prisma, UserRole.USER);
    userAuthHeader = userSession.authHeader;

    // Create a base category for tests that need an ID
    const category = await prisma.locationCategory.create({
      data: {
        name: `Base Cat ${Date.now()}`,
        code: `TEST-LC-BASE-${Math.random().toString(36).substring(7)}`,
        isActive: true
      }
    });
    categoryId = category.id;
  });

  afterAll(async () => {
    await prisma.taxRate.deleteMany({ where: { locationCategoryId: categoryId } });
    await prisma.locationCategory.deleteMany({ where: { id: categoryId } });
    await prisma.locationCategory.deleteMany({ where: { code: { startsWith: "TEST-LC-" } } });
    await prisma.session.deleteMany({
      where: { userId: { startsWith: 'test-' } }
    });
    await prisma.user.deleteMany({
      where: { id: { startsWith: 'test-' } }
    });
  });

  describe('POST /api/v1/location-categories', () => {
    it('should create a new location category (Admin)', async () => {
      const payload = {
        name: 'Fresh Category',
        code: `TEST-LC-NEW-${Date.now()}`,
        priority: 1
      };

      const res = await request(app)
        .post('/api/v1/location-categories')
        .set('Authorization', adminAuthHeader)
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('should return 403 if user is not authorized', async () => {
      const res = await request(app)
        .post('/api/v1/location-categories')
        .set('Authorization', userAuthHeader)
        .send({ name: 'Fail', code: `TEST-LC-FAIL-${Date.now()}` });

      expect(res.status).toBe(403);
    });
  });

  describe('GET /api/v1/location-categories', () => {
    it('should list location categories', async () => {
      const res = await request(app)
        .get('/api/v1/location-categories')
        .set('Authorization', adminAuthHeader);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('PATCH /api/v1/location-categories/:id', () => {
    it('should update a category', async () => {
      const res = await request(app)
        .patch(`/api/v1/location-categories/${categoryId}`)
        .set('Authorization', adminAuthHeader)
        .send({ name: 'Updated Name' });

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe('Updated Name');
    });
  });
});
