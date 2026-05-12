import { PrismaClient, UserRole, UserStatus, OwnershipType, DocumentStatus, AssessmentStatus, PaymentMethod, PaymentStatus, ConfirmationStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Seed Users
  console.log('👤 Seeding users...');
  
  const users = [
    {
      name: 'System Admin',
      email: 'admin@hermata.local',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    },
    {
      name: 'Kebele Manager',
      email: 'manager@hermata.local',
      role: UserRole.MANAGER,
      status: UserStatus.ACTIVE,
    },
    {
      name: 'Assigned Worker',
      email: 'worker@hermata.local',
      role: UserRole.ASSIGNED_WORKER,
      status: UserStatus.ACTIVE,
    },
    {
      name: 'Demo House Owner',
      email: 'owner@hermata.local',
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
    },
    {
      name: 'Second House Owner',
      email: 'owner2@hermata.local',
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
    },
  ];

  const seededUsers: any = {};

  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        role: userData.role,
        status: userData.status,
      },
      create: userData,
    });
    seededUsers[userData.email] = user;
    console.log(`   - User upserted: ${userData.email}`);
  }

  // 2. Seed Location Categories
  console.log('📍 Seeding location categories...');
  
  const categories = [
    {
      code: 'A',
      name: 'City Center / Main Road',
      description: 'Higher-value area close to town center, main road, or commercial activity',
      priority: 1,
      isActive: true,
    },
    {
      code: 'B',
      name: 'Developed Residential Area',
      description: 'Residential area near town or developed services',
      priority: 2,
      isActive: true,
    },
    {
      code: 'C',
      name: 'Inner Village / Less Developed Area',
      description: 'Lower-value area farther from town center',
      priority: 3,
      isActive: true,
    },
  ];

  const seededCategories: any = {};

  for (const catData of categories) {
    const category = await prisma.locationCategory.upsert({
      where: { code: catData.code },
      update: {
        name: catData.name,
        description: catData.description,
        priority: catData.priority,
        isActive: catData.isActive,
      },
      create: catData,
    });
    seededCategories[catData.code] = category;
    console.log(`   - Category upserted: ${catData.code}`);
  }

  // 3. Seed Tax Rates
  console.log('💰 Seeding tax rates...');
  
  const currentYear = new Date().getFullYear();
  const admin = seededUsers['admin@hermata.local'];

  const taxRates = [
    { year: currentYear, cat: 'A', rate: 5.00 },
    { year: currentYear, cat: 'B', rate: 3.50 },
    { year: currentYear, cat: 'C', rate: 2.00 },
    { year: currentYear - 1, cat: 'A', rate: 4.50 },
    { year: currentYear - 1, cat: 'B', rate: 3.00 },
    { year: currentYear - 1, cat: 'C', rate: 1.75 },
  ];

  const seededTaxRates: any = {};

  for (const rate of taxRates) {
    const category = seededCategories[rate.cat];
    const taxRate = await prisma.taxRate.upsert({
      where: {
        taxYear_locationCategoryId: {
          taxYear: rate.year,
          locationCategoryId: category.id,
        },
      },
      update: {
        ratePerKare: rate.rate,
        isActive: true,
      },
      create: {
        taxYear: rate.year,
        locationCategoryId: category.id,
        ratePerKare: rate.rate,
        createdById: admin.id,
        isActive: true,
      },
    });
    const key = `${rate.year}-${rate.cat}`;
    seededTaxRates[key] = taxRate;
    console.log(`   - Tax Rate upserted: ${key} (${rate.rate} ETB/kare)`);
  }

  // 4. Seed House Owner Profiles
  console.log('🏠 Seeding house owner profiles...');
  
  const profiles = [
    {
      email: 'owner@hermata.local',
      fullName: 'Demo House Owner',
      phone: '+251900000001',
      kebeleIdNumber: 'HK-OWN-001',
      address: 'Hermata Kebele',
    },
    {
      email: 'owner2@hermata.local',
      fullName: 'Second House Owner',
      phone: '+251900000002',
      kebeleIdNumber: 'HK-OWN-002',
      address: 'Hermata Kebele',
    },
  ];

  const seededProfiles: any = {};

  for (const profile of profiles) {
    const user = seededUsers[profile.email];
    const houseOwnerProfile = await prisma.houseOwnerProfile.upsert({
      where: { userId: user.id },
      update: {
        fullName: profile.fullName,
        phone: profile.phone,
        kebeleIdNumber: profile.kebeleIdNumber,
        address: profile.address,
      },
      create: {
        userId: user.id,
        fullName: profile.fullName,
        phone: profile.phone,
        kebeleIdNumber: profile.kebeleIdNumber,
        address: profile.address,
      },
    });
    seededProfiles[profile.email] = houseOwnerProfile;
    console.log(`   - Profile upserted: ${profile.fullName}`);
  }

  // 5. Seed Properties
  console.log('🏗️ Seeding properties...');
  
  const owner1 = seededProfiles['owner@hermata.local'];
  const owner2 = seededProfiles['owner2@hermata.local'];
  const manager = seededUsers['manager@hermata.local'];

  const properties = [
    {
      ownerId: owner1.id,
      houseNumber: 'H-001',
      fileNumber: 'F-001',
      landSizeKare: 400,
      locationCategory: 'A',
      ownershipType: OwnershipType.LEASE,
      status: 'APPROVED',
      approvedById: admin.id,
      approvedAt: new Date(),
    },
    {
      ownerId: owner2.id,
      houseNumber: 'H-002',
      fileNumber: 'F-002',
      landSizeKare: 250,
      locationCategory: 'B',
      ownershipType: OwnershipType.OLD_POSSESSION,
      status: 'SUBMITTED',
    },
    {
      ownerId: owner1.id,
      houseNumber: 'H-003',
      fileNumber: 'F-003',
      landSizeKare: 300,
      locationCategory: 'C',
      ownershipType: OwnershipType.OTHER,
      status: 'UNDER_REVIEW',
      reviewedById: manager.id,
      reviewedAt: new Date(),
    },
  ];

  const seededProperties: any = {};

  for (const prop of properties) {
    const category = seededCategories[prop.locationCategory];
    const property = await prisma.property.upsert({
      where: { houseNumber: prop.houseNumber },
      update: {
        status: prop.status as any,
        locationCategoryId: category.id,
        landSizeKare: prop.landSizeKare,
        ownershipType: prop.ownershipType,
      },
      create: {
        ownerId: prop.ownerId,
        houseNumber: prop.houseNumber,
        fileNumber: prop.fileNumber,
        landSizeKare: prop.landSizeKare,
        locationCategoryId: category.id,
        ownershipType: prop.ownershipType,
        status: prop.status as any,
        approvedById: prop.approvedById,
        approvedAt: prop.approvedAt,
        reviewedById: prop.reviewedById,
        reviewedAt: prop.reviewedAt,
      },
    });
    seededProperties[prop.houseNumber] = property;
    console.log(`   - Property upserted: ${prop.houseNumber}`);
  }

  // 6. Seed Property Documents
  console.log('📄 Seeding property documents...');
  
  const propH001 = seededProperties['H-001'];
  const propH002 = seededProperties['H-002'];

  const documents = [
    {
      propertyId: propH001.id,
      title: 'Ownership Evidence',
      documentType: 'OWNERSHIP',
      fileUrl: '/uploads/demo/ownership-evidence.pdf',
      fileName: 'ownership-evidence.pdf',
      status: DocumentStatus.APPROVED,
      uploadedById: seededUsers['owner@hermata.local'].id,
      reviewedById: admin.id,
      reviewedAt: new Date(),
    },
    {
      propertyId: propH002.id,
      title: 'Kebele File Reference',
      documentType: 'FILE_REFERENCE',
      fileUrl: '/uploads/demo/file-reference.pdf',
      fileName: 'file-reference.pdf',
      status: DocumentStatus.PENDING,
      uploadedById: seededUsers['owner2@hermata.local'].id,
    },
  ];

  for (const doc of documents) {
    await prisma.propertyDocument.upsert({
      where: { id: `demo-doc-${doc.propertyId}-${doc.title.replace(/\s+/g, '-')}` },
      update: {
        status: doc.status,
      },
      create: {
        id: `demo-doc-${doc.propertyId}-${doc.title.replace(/\s+/g, '-')}`,
        propertyId: doc.propertyId,
        title: doc.title,
        documentType: doc.documentType,
        fileUrl: doc.fileUrl,
        fileName: doc.fileName,
        status: doc.status,
        uploadedById: doc.uploadedById,
        reviewedById: doc.reviewedById,
        reviewedAt: doc.reviewedAt,
      },
    });
    console.log(`   - Document seeded for property: ${doc.propertyId}`);
  }

  // 7. Seed Assessments
  console.log('🧾 Seeding assessments...');
  
  const propH001Approved = seededProperties['H-001'];
  const taxRateA = seededTaxRates[`${currentYear}-A`];
  const taxRateAPrev = seededTaxRates[`${currentYear - 1}-A`];

  const assessments = [
    {
      propertyId: propH001Approved.id,
      taxRateId: taxRateA.id,
      taxYear: currentYear,
      landSizeKare: 400,
      ratePerKare: 5.00,
      baseAmount: 2000.00,
      penaltyAmount: 0,
      previousBalance: 0,
      totalAmount: 2000.00,
      status: AssessmentStatus.ISSUED,
      issuedById: manager.id,
      issuedAt: new Date(),
    },
    {
      propertyId: propH001Approved.id,
      taxRateId: taxRateAPrev.id,
      taxYear: currentYear - 1,
      landSizeKare: 400,
      ratePerKare: 4.50,
      baseAmount: 1800.00,
      penaltyAmount: 0,
      previousBalance: 0,
      totalAmount: 1800.00,
      status: AssessmentStatus.PAID,
      issuedById: manager.id,
      issuedAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
    },
  ];

  const seededAssessments: any = {};

  for (const assess of assessments) {
    const assessment = await prisma.taxAssessment.upsert({
      where: {
        propertyId_taxYear: {
          propertyId: assess.propertyId,
          taxYear: assess.taxYear,
        },
      },
      update: {
        status: assess.status,
      },
      create: assess,
    });
    seededAssessments[`${assess.propertyId}-${assess.taxYear}`] = assessment;
    console.log(`   - Assessment upserted for property H-001, Year ${assess.taxYear}`);
  }

  // 8. Seed Payments
  console.log('💳 Seeding payments...');
  
  const assessmentPrev = seededAssessments[`${propH001Approved.id}-${currentYear - 1}`];

  const payment = await prisma.payment.upsert({
    where: { id: `demo-payment-${assessmentPrev.id}` },
    update: {
      status: PaymentStatus.VERIFIED,
    },
    create: {
      id: `demo-payment-${assessmentPrev.id}`,
      assessmentId: assessmentPrev.id,
      method: PaymentMethod.SINQEE_BANK,
      status: PaymentStatus.VERIFIED,
      amount: assessmentPrev.totalAmount,
      paidAt: new Date(assessmentPrev.issuedAt!.getTime() + 2 * 24 * 60 * 60 * 1000),
      referenceNumber: 'SINQEE-DEMO-001',
      bankName: 'Sinqee Bank',
      bankBranch: 'Hermata Branch',
      receiptFileUrl: '/uploads/demo/sinqee-receipt.pdf',
      verifiedById: manager.id,
      verifiedAt: new Date(),
    },
  });
  console.log(`   - Payment seeded for assessment ${assessmentPrev.id}`);

  // 9. Seed Confirmation
  console.log('🎗️ Seeding confirmations...');
  
  await prisma.kebeleConfirmation.upsert({
    where: { paymentId: payment.id },
    update: {
      status: ConfirmationStatus.ISSUED,
    },
    create: {
      paymentId: payment.id,
      confirmationNumber: `KHC-${currentYear - 1}-000001`,
      status: ConfirmationStatus.ISSUED,
      issuedById: manager.id,
      issuedAt: new Date(),
      note: 'Demo confirmation for paid property tax',
    },
  });
  console.log(`   - Confirmation seeded for payment ${payment.id}`);

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
