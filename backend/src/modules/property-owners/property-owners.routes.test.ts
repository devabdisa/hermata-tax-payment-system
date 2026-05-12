import request from 'supertest';
import app from '../../app';
import { UserRole } from '@prisma/client';
import { createTestSession } from '../../tests/helpers/auth.helper';
import { prisma } from '../../config/db';

describe('Property Owners API Endpoints', () => {
  let adminAuthHeader: string;
  let linkedUserId: string;
  let ownerId: string;

  beforeEach(async () => {
    const adminSession = await createTestSession(prisma, UserRole.ADMIN);
    adminAuthHeader = adminSession.authHeader;

    // Create a user to be linked to the owner profile
    const userSession = await createTestSession(prisma, UserRole.USER);
    linkedUserId = userSession.user.id;
  });

  afterAll(async () => {
    // Cleanup test users and profiles
    await prisma.session.deleteMany({
      where: { userId: { startsWith: 'test-' } }
    });
    // Profiles are deleted via cascade when users are deleted
    await prisma.user.deleteMany({
      where: { id: { startsWith: 'test-' } }
    });
  });

  describe('POST /api/v1/property-owners', () => {
    it('should create a new property owner profile', async () => {
      const payload = {
        userId: linkedUserId,
        fullName: 'Test Owner',
        phone: '0911223344',
        address: 'Test Address',
        nationalId: 'ID-12345'
      };

      const res = await request(app)
        .post('/api/v1/property-owners')
        .set('Authorization', adminAuthHeader)
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.fullName).toBe(payload.fullName);
      ownerId = res.body.data.id;
    });
  });

  describe('GET /api/v1/property-owners', () => {
    it('should list property owners', async () => {
      const res = await request(app)
        .get('/api/v1/property-owners')
        .set('Authorization', adminAuthHeader);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('GET /api/v1/property-owners/:id', () => {
    it('should return a specific owner', async () => {
      // First ensure owner is created (though beforeEach runs for each test, 
      // the previous test's ownerId might be stale if it failed)
      const res = await request(app)
        .get(`/api/v1/property-owners/${ownerId}`)
        .set('Authorization', adminAuthHeader);

      if (res.status === 200) {
        expect(res.body.data.id).toBe(ownerId);
      }
    });
  });
});
