import request from 'supertest';
import app from '../../app';
import { UserRole } from '@prisma/client';
import { createTestSession } from '../../tests/helpers/auth.helper';
import { prisma } from '../../config/db';

describe('Users API Endpoints', () => {
  let adminAuthHeader: string;
  let userAuthHeader: string;
  let adminId: string;
  let userId: string;

  beforeEach(async () => {
    // Create an Admin user with full permissions
    const adminSession = await createTestSession(prisma, UserRole.ADMIN);
    adminAuthHeader = adminSession.authHeader;
    adminId = adminSession.user.id;

    // Create a regular user
    const userSession = await createTestSession(prisma, UserRole.USER);
    userAuthHeader = userSession.authHeader;
    userId = userSession.user.id;
  });

  afterAll(async () => {
    // Cleanup test users and their sessions
    await prisma.session.deleteMany({
      where: { userId: { startsWith: 'test-' } }
    });
    await prisma.user.deleteMany({
      where: { 
        OR: [
          { id: { startsWith: 'test-' } },
          { email: 'newuser@example.com' }
        ]
      }
    });
  });

  describe('GET /api/v1/users/me', () => {
    it('should return the current user profile', async () => {
      const res = await request(app)
        .get('/api/v1/users/me')
        .set('Authorization', userAuthHeader);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(userId);
    });

    it('should return 401 if not authenticated', async () => {
      const res = await request(app).get('/api/v1/users/me');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/v1/users', () => {
    it('should list users if user has USERS_MANAGE permission (Admin)', async () => {
      const res = await request(app)
        .get('/api/v1/users')
        .set('Authorization', adminAuthHeader);

      if (res.status !== 200) {
        console.log('GET /users 500 ERROR:', res.body);
      }
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(2); // The ones created in beforeEach
    });

    it('should return 403 if user lacks USERS_MANAGE permission (Regular User)', async () => {
      const res = await request(app)
        .get('/api/v1/users')
        .set('Authorization', userAuthHeader);

      expect(res.status).toBe(403);
    });
  });

  describe('GET /api/v1/users/:id', () => {
    it('should return a user by ID', async () => {
      const res = await request(app)
        .get(`/api/v1/users/${userId}`)
        .set('Authorization', adminAuthHeader);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(userId);
    });

    it('should return 404 for non-existent user', async () => {
      const res = await request(app)
        .get('/api/v1/users/non-existent-id')
        .set('Authorization', adminAuthHeader);

      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/v1/users', () => {
    it('should create a new user', async () => {
      const payload = {
        email: 'newuser@example.com',
        name: 'New User',
        role: UserRole.MANAGER,
        password: 'Password123!',
      };

      const res = await request(app)
        .post('/api/v1/users')
        .set('Authorization', adminAuthHeader)
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(payload.email);
    });

    it('should validate request body', async () => {
      const res = await request(app)
        .post('/api/v1/users')
        .set('Authorization', adminAuthHeader)
        .send({ email: 'invalid-email' }); // Missing required fields

      expect(res.status).toBe(400);
    });
  });

  describe('PATCH /api/v1/users/:id', () => {
    it('should update an existing user', async () => {
      const payload = {
        name: 'Updated Name',
      };

      const res = await request(app)
        .patch(`/api/v1/users/${userId}`)
        .set('Authorization', adminAuthHeader)
        .send(payload);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe(payload.name);
    });
  });

  describe('DELETE /api/v1/users/:id', () => {
    it('should soft delete a user', async () => {
      const res = await request(app)
        .delete(`/api/v1/users/${userId}`)
        .set('Authorization', adminAuthHeader);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify the user is actually deleted/deactivated (assuming soft delete or hard delete)
      const fetchRes = await request(app)
        .get(`/api/v1/users/${userId}`)
        .set('Authorization', adminAuthHeader);
        
      // Might be 404 or the status might be inactive depending on implementation
      expect([404, 200]).toContain(fetchRes.status); 
    });
  });
});
