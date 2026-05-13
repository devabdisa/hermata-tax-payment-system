import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is not set');

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🚀 Starting NUCLEAR ERASE of the database...');

  // The order matters due to foreign key constraints!
  await prisma.kebeleConfirmation.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.taxAssessment.deleteMany();
  await prisma.propertyDocument.deleteMany();
  await prisma.property.deleteMany();
  await prisma.houseOwnerProfile.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.taxRate.deleteMany();
  await prisma.locationCategory.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.user.deleteMany();

  console.log('✨ Database is now 100% empty and clean!');
}

main()
  .catch((e) => {
    console.error('❌ Wipe failed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
