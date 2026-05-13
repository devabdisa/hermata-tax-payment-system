import { PrismaClient, UserRole, UserStatus, OwnershipType, AssessmentStatus, PaymentMethod, PaymentStatus, ConfirmationStatus, PropertyStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is not set');

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting BULK database seeding...');
  
  // Clean up existing generated data to avoid unique constraint violations
  console.log('🧹 Cleaning up existing data...');
  await prisma.kebeleConfirmation.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.taxAssessment.deleteMany();
  await prisma.propertyDocument.deleteMany();
  await prisma.property.deleteMany();
  await prisma.houseOwnerProfile.deleteMany();
  await prisma.user.deleteMany({
    where: {
      role: UserRole.USER
    }
  });

  // Ensure basic setup exists
  const admin = await prisma.user.upsert({
    where: { email: 'admin@hermata.local' },
    update: {},
    create: {
      name: 'System Admin',
      email: 'admin@hermata.local',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: 'manager@hermata.local' },
    update: {},
    create: {
      name: 'Kebele Manager',
      email: 'manager@hermata.local',
      role: UserRole.MANAGER,
      status: UserStatus.ACTIVE,
    },
  });

  // Seed Location Categories if they don't exist
  const categoriesData = [
    { code: 'A', name: 'City Center', priority: 1 },
    { code: 'B', name: 'Developed Residential', priority: 2 },
    { code: 'C', name: 'Inner Village', priority: 3 },
  ];
  
  const categories = [];
  for (const cat of categoriesData) {
    const category = await prisma.locationCategory.upsert({
      where: { code: cat.code },
      update: {},
      create: cat,
    });
    categories.push(category);
  }

  // Seed Tax Rates
  const currentYear = new Date().getFullYear();
  const taxRates = [];
  for (const cat of categories) {
    const rate = await prisma.taxRate.upsert({
      where: {
        taxYear_locationCategoryId: { taxYear: currentYear, locationCategoryId: cat.id },
      },
      update: {},
      create: {
        taxYear: currentYear,
        locationCategoryId: cat.id,
        ratePerKare: cat.code === 'A' ? 5.00 : cat.code === 'B' ? 3.50 : 2.00,
        createdById: admin.id,
        isActive: true,
      },
    });
    taxRates.push(rate);
  }

  // Generate 50 Users & Owners
  console.log('👤 Seeding 50 owners...');
  const owners = [];
  for (let i = 0; i < 50; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName }).toLowerCase();
    
    const user = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email: email,
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
        ownerProfile: {
          create: {
            fullName: `${firstName} ${lastName}`,
            phone: faker.phone.number({ style: 'international' }),
            kebeleIdNumber: `HK-OWN-${faker.string.numeric(5)}`,
            address: faker.location.streetAddress(),
          }
        }
      },
      include: { ownerProfile: true }
    });
    owners.push(user.ownerProfile!);
  }

  // Generate 100 Properties
  console.log('🏠 Seeding 100 properties...');
  const properties = [];
  const propertyStatuses = [PropertyStatus.APPROVED, PropertyStatus.APPROVED, PropertyStatus.UNDER_REVIEW, PropertyStatus.SUBMITTED];
  const ownershipTypes = [OwnershipType.LEASE, OwnershipType.OLD_POSSESSION, OwnershipType.OTHER];

  for (let i = 0; i < 100; i++) {
    const owner = faker.helpers.arrayElement(owners);
    const category = faker.helpers.arrayElement(categories);
    const status = faker.helpers.arrayElement(propertyStatuses);
    
    const prop = await prisma.property.create({
      data: {
        ownerId: owner.id,
        houseNumber: `H-${faker.string.alphanumeric(6).toUpperCase()}`,
        fileNumber: `F-${faker.string.alphanumeric(6).toUpperCase()}`,
        landSizeKare: faker.number.int({ min: 100, max: 1000 }),
        locationCategoryId: category.id,
        ownershipType: faker.helpers.arrayElement(ownershipTypes),
        status: status,
        approvedById: status === PropertyStatus.APPROVED ? admin.id : null,
        approvedAt: status === PropertyStatus.APPROVED ? faker.date.recent({ days: 90 }) : null,
        createdAt: faker.date.past({ years: 1 }),
      }
    });
    properties.push(prop);
  }

  // Generate Assessments for Approved Properties
  console.log('🧾 Seeding assessments...');
  const approvedProperties = properties.filter(p => p.status === PropertyStatus.APPROVED);
  const assessments = [];
  
  for (const prop of approvedProperties) {
    const rate = taxRates.find(r => r.locationCategoryId === prop.locationCategoryId)!;
    const baseAmount = Number(prop.landSizeKare) * Number(rate.ratePerKare);
    const isPaid = faker.datatype.boolean();
    
    const assessment = await prisma.taxAssessment.create({
      data: {
        propertyId: prop.id,
        taxRateId: rate.id,
        taxYear: currentYear,
        landSizeKare: prop.landSizeKare,
        ratePerKare: rate.ratePerKare,
        baseAmount: baseAmount,
        totalAmount: baseAmount,
        status: isPaid ? AssessmentStatus.PAID : AssessmentStatus.ISSUED,
        issuedById: manager.id,
        issuedAt: faker.date.recent({ days: 60 }),
      }
    });
    assessments.push(assessment);

    // Generate Payments for Paid Assessments
    if (isPaid) {
      const payment = await prisma.payment.create({
        data: {
          assessmentId: assessment.id,
          method: faker.helpers.arrayElement([PaymentMethod.SINQEE_BANK, PaymentMethod.CHAPA, PaymentMethod.CASH_MANUAL]),
          status: PaymentStatus.VERIFIED,
          amount: baseAmount,
          paidAt: faker.date.recent({ days: 30 }),
          referenceNumber: `REF-${faker.string.alphanumeric(8).toUpperCase()}`,
          verifiedById: manager.id,
          verifiedAt: faker.date.recent({ days: 10 }),
        }
      });

      // Generate Confirmations for some payments
      if (faker.datatype.boolean()) {
        await prisma.kebeleConfirmation.create({
          data: {
            paymentId: payment.id,
            confirmationNumber: `KHC-${currentYear}-${faker.string.numeric(6)}`,
            status: ConfirmationStatus.ISSUED,
            issuedById: manager.id,
            issuedAt: faker.date.recent({ days: 5 }),
          }
        });
      }
    }
  }

  console.log('✅ Bulk seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
