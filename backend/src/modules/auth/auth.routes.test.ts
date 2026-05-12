import request from 'supertest';
import app from '../../app';

describe('Auth API Endpoints', () => {
  describe('GET /api/v1/auth', () => {
    it('should return auth module ready', async () => {
      const res = await request(app).get('/api/v1/auth');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('auth module ready');
    });
  });

  describe('POST /api/v1/auth', () => {
    it('should return placeholder response', async () => {
      const res = await request(app).post('/api/v1/auth');
      expect(res.status).toBe(201);
      expect(res.body.message).toBe('auth created (placeholder)');
    });
  });
});
