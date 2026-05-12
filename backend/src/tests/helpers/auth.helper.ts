import { PrismaClient, UserRole, UserStatus } from '@prisma/client';
import { randomUUID } from 'crypto';

/**
 * Creates a mock user and a corresponding session in the database.
 * Returns the session token to be used in Authorization headers.
 */
export async function createTestSession(
  prisma: PrismaClient,
  role: UserRole = UserRole.USER,
  status: UserStatus = UserStatus.ACTIVE
) {
  const uniqueToken = randomUUID();

  // Create mock user and session in a transaction to ensure atomic consistency
  // and handle potential DB constraints more gracefully.
  const sessionToken = `token-${uniqueToken}`;

  const user = await prisma.user.create({
    data: {
      email: `test-${uniqueToken}@example.com`,
      name: `Test User ${role}`,
      role: role,
      status: status,
      emailVerified: true,
      sessions: {
        create: {
          token: sessionToken,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
          ipAddress: '127.0.0.1',
          userAgent: 'jest-test',
        }
      }
    },
    include: {
      sessions: true
    }
  });

  return {
    user,
    token: sessionToken,
    authHeader: `Bearer ${sessionToken}`,
  };
}
