import { prisma } from '../config/db';

beforeAll(async () => {
  // Check connection
  await prisma.$connect();
});

// We DO NOT truncate the database because we are running against a shared/remote development database.
// Tests are responsible for cleaning up their own data.

afterAll(async () => {
  await prisma.$disconnect();
});
