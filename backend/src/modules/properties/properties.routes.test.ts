import request from 'supertest';
import app from '../../app';
import { UserRole, OwnershipType } from '@prisma/client';
import { createTestSession } from '../../tests/helpers/auth.helper';
import { prisma } from '../../config/db';

describe('Properties API Endpoints', () => {
  let adminAuthHeader: string;
  let ownerId: string;
  let categoryId: string;
  let propertyId: string;

  beforeAll(async () => {
    const adminSession = await createTestSession(prisma, UserRole.ADMIN);
    adminAuthHeader = adminSession.authHeader;

    // Create a category
    const category = await prisma.locationCategory.create({
      data: {
        name: 'Property Test Category',
        code: 'TEST-PROP-001'
      }
    });
    categoryId = category.id;

    // Create an owner
    const userSession = await createTestSession(prisma, UserRole.USER);
    const owner = await prisma.houseOwnerProfile.create({
      data: {
        userId: userSession.user.id,
        fullName: 'Property Test Owner',
        phone: '0911556677'
      }
    });
    ownerId = owner.id;
  });

  afterAll(async () => {
    // Cleanup
    await prisma.property.deleteMany({
      where: { houseNumber: { startsWith: 'TEST-HOUSE-' } }
    });
    await prisma.houseOwnerProfile.deleteMany({
      where: { id: ownerId }
    });
    await prisma.locationCategory.deleteMany({
      where: { id: categoryId }
    });
    await prisma.session.deleteMany({
      where: { userId: { startsWith: 'test-' } }
    });
    await prisma.user.deleteMany({
      where: { id: { startsWith: 'test-' } }
    });
  });

  describe('POST /api/v1/properties', () => {
    it('should create a new property', async () => {
      const payload = {
        ownerId,
        houseNumber: `TEST-HOUSE-${Date.now()}`,
        fileNumber: `TEST-FILE-${Date.now()}`,
        landSizeKare: 200,
        locationCategoryId: categoryId,
        ownershipType: OwnershipType.LEASE
      };

      const res = await request(app)
        .post('/api/v1/properties')
        .set('Authorization', adminAuthHeader)
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      propertyId = res.body.data.id;
    });
  });

  describe('GET /api/v1/properties', () => {
    it('should list properties', async () => {
      const res = await request(app)
        .get('/api/v1/properties')
        .set('Authorization', adminAuthHeader);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});
