import {
  PrismaClient,
  UserRole,
  UserStatus,
  OwnershipType,
  PropertyStatus,
  DocumentStatus,
  AssessmentStatus,
  PaymentMethod,
  PaymentStatus,
  ConfirmationStatus,
} from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import dotenv from "dotenv";
import { hashPassword } from "better-auth/crypto";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const DEMO_EMAILS = [
  "admin@hermata.local",
  "manager@hermata.local",
  "worker@hermata.local",
  "owner@hermata.local",
  "owner2@hermata.local",
] as const;

const DEMO_HOUSE_NUMBERS = ["H-001", "H-002", "H-003", "H-004", "H-005"] as const;
const DEMO_FILE_NUMBERS = ["F-001", "F-002", "F-003", "F-004", "F-005"] as const;
const DEMO_PASSWORD = process.env.DEMO_USER_PASSWORD || "Demo12345!";

async function ensureCredentialAccount(user: { id: string }, plainPassword: string) {
  const passwordHash = await hashPassword(plainPassword);
  const existingCredentialAccount = await prisma.account.findFirst({
    where: {
      userId: user.id,
      providerId: "credential",
    },
    select: { id: true },
  });

  if (existingCredentialAccount) {
    await prisma.account.update({
      where: { id: existingCredentialAccount.id },
      data: {
        password: passwordHash,
      },
    });
    return;
  }

  await prisma.account.create({
    data: {
      userId: user.id,
      providerId: "credential",
      accountId: user.id,
      password: passwordHash,
    },
  });
}

async function resetDemoOwnedData() {
  const demoUsers = await prisma.user.findMany({
    where: { email: { in: [...DEMO_EMAILS] } },
    select: { id: true, email: true },
  });

  const demoUserIds = demoUsers.map((u) => u.id);

  const demoOwnerProfiles = await prisma.houseOwnerProfile.findMany({
    where: { userId: { in: demoUserIds } },
    select: { id: true },
  });
  const demoOwnerIds = demoOwnerProfiles.map((p) => p.id);

  const demoProperties = await prisma.property.findMany({
    where: {
      OR: [
        { ownerId: { in: demoOwnerIds } },
        { houseNumber: { in: [...DEMO_HOUSE_NUMBERS] } },
        { fileNumber: { in: [...DEMO_FILE_NUMBERS] } },
      ],
    },
    select: { id: true },
  });
  const demoPropertyIds = demoProperties.map((p) => p.id);

  const demoAssessments = await prisma.taxAssessment.findMany({
    where: { propertyId: { in: demoPropertyIds } },
    select: { id: true },
  });
  const demoAssessmentIds = demoAssessments.map((a) => a.id);

  const demoPayments = await prisma.payment.findMany({
    where: {
      OR: [
        { assessmentId: { in: demoAssessmentIds } },
        { referenceNumber: { startsWith: "SINQEE-DEMO-" } },
        { receiptFileUrl: { contains: "/uploads/demo/" } },
      ],
    },
    select: { id: true },
  });
  const demoPaymentIds = demoPayments.map((p) => p.id);

  // Delete in FK-safe order.
  await prisma.kebeleConfirmation.deleteMany({
    where: {
      OR: [
        { paymentId: { in: demoPaymentIds } },
        { confirmationNumber: { startsWith: "KHC-" } },
      ],
    },
  });

  await prisma.payment.deleteMany({
    where: { id: { in: demoPaymentIds } },
  });

  await prisma.taxAssessment.deleteMany({
    where: { id: { in: demoAssessmentIds } },
  });

  await prisma.propertyDocument.deleteMany({
    where: {
      OR: [
        { propertyId: { in: demoPropertyIds } },
        { fileUrl: { contains: "/uploads/demo/" } },
      ],
    },
  });

  await prisma.property.deleteMany({
    where: { id: { in: demoPropertyIds } },
  });
}

async function main() {
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;

  console.log("Seeding demo workflow data...");

  await resetDemoOwnedData();

  // Users
  const admin = await prisma.user.upsert({
    where: { email: "admin@hermata.local" },
    update: { name: "System Admin", role: UserRole.ADMIN, status: UserStatus.ACTIVE },
    create: {
      name: "System Admin",
      email: "admin@hermata.local",
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: "manager@hermata.local" },
    update: { name: "Kebele Manager", role: UserRole.MANAGER, status: UserStatus.ACTIVE },
    create: {
      name: "Kebele Manager",
      email: "manager@hermata.local",
      role: UserRole.MANAGER,
      status: UserStatus.ACTIVE,
    },
  });

  const worker = await prisma.user.upsert({
    where: { email: "worker@hermata.local" },
    update: { name: "Assigned Worker", role: UserRole.ASSIGNED_WORKER, status: UserStatus.ACTIVE },
    create: {
      name: "Assigned Worker",
      email: "worker@hermata.local",
      role: UserRole.ASSIGNED_WORKER,
      status: UserStatus.ACTIVE,
    },
  });

  const ownerUser1 = await prisma.user.upsert({
    where: { email: "owner@hermata.local" },
    update: { name: "Demo House Owner", role: UserRole.USER, status: UserStatus.ACTIVE },
    create: {
      name: "Demo House Owner",
      email: "owner@hermata.local",
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
    },
  });

  const ownerUser2 = await prisma.user.upsert({
    where: { email: "owner2@hermata.local" },
    update: { name: "Second House Owner", role: UserRole.USER, status: UserStatus.ACTIVE },
    create: {
      name: "Second House Owner",
      email: "owner2@hermata.local",
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
    },
  });

  await ensureCredentialAccount(admin, DEMO_PASSWORD);
  await ensureCredentialAccount(manager, DEMO_PASSWORD);
  await ensureCredentialAccount(worker, DEMO_PASSWORD);
  await ensureCredentialAccount(ownerUser1, DEMO_PASSWORD);
  await ensureCredentialAccount(ownerUser2, DEMO_PASSWORD);

  // Owner profiles
  const ownerProfile1 = await prisma.houseOwnerProfile.upsert({
    where: { userId: ownerUser1.id },
    update: {
      fullName: "Demo House Owner",
      phone: "+251900000001",
      kebeleIdNumber: "HK-OWN-001",
      nationalId: "NID-DEMO-001",
      address: "Hermata Kebele",
    },
    create: {
      userId: ownerUser1.id,
      fullName: "Demo House Owner",
      phone: "+251900000001",
      kebeleIdNumber: "HK-OWN-001",
      nationalId: "NID-DEMO-001",
      address: "Hermata Kebele",
    },
  });

  const ownerProfile2 = await prisma.houseOwnerProfile.upsert({
    where: { userId: ownerUser2.id },
    update: {
      fullName: "Second House Owner",
      phone: "+251900000002",
      kebeleIdNumber: "HK-OWN-002",
      nationalId: "NID-DEMO-002",
      address: "Hermata Kebele",
    },
    create: {
      userId: ownerUser2.id,
      fullName: "Second House Owner",
      phone: "+251900000002",
      kebeleIdNumber: "HK-OWN-002",
      nationalId: "NID-DEMO-002",
      address: "Hermata Kebele",
    },
  });

  // Location categories
  const categoryA = await prisma.locationCategory.upsert({
    where: { code: "A" },
    update: {
      name: "City Center / Main Road",
      description: "Higher-value area close to town center, main road, or commercial activity",
      priority: 1,
      isActive: true,
    },
    create: {
      code: "A",
      name: "City Center / Main Road",
      description: "Higher-value area close to town center, main road, or commercial activity",
      priority: 1,
      isActive: true,
    },
  });

  const categoryB = await prisma.locationCategory.upsert({
    where: { code: "B" },
    update: {
      name: "Developed Residential Area",
      description: "Residential area near town or developed services",
      priority: 2,
      isActive: true,
    },
    create: {
      code: "B",
      name: "Developed Residential Area",
      description: "Residential area near town or developed services",
      priority: 2,
      isActive: true,
    },
  });

  const categoryC = await prisma.locationCategory.upsert({
    where: { code: "C" },
    update: {
      name: "Inner Village / Less Developed Area",
      description: "Lower-value area farther from town center",
      priority: 3,
      isActive: true,
    },
    create: {
      code: "C",
      name: "Inner Village / Less Developed Area",
      description: "Lower-value area farther from town center",
      priority: 3,
      isActive: true,
    },
  });

  const categories = { A: categoryA, B: categoryB, C: categoryC };

  // Tax rates (demo values)
  const rates = [
    { year: currentYear, code: "A", amount: 5.0 },
    { year: currentYear, code: "B", amount: 3.5 },
    { year: currentYear, code: "C", amount: 2.0 },
    { year: previousYear, code: "A", amount: 4.5 },
    { year: previousYear, code: "B", amount: 3.0 },
    { year: previousYear, code: "C", amount: 1.75 },
  ] as const;

  const rateMap = new Map<string, string>();
  for (const r of rates) {
    const category = categories[r.code];
    const taxRate = await prisma.taxRate.upsert({
      where: {
        taxYear_locationCategoryId: {
          taxYear: r.year,
          locationCategoryId: category.id,
        },
      },
      update: {
        ratePerKare: r.amount,
        isActive: true,
      },
      create: {
        taxYear: r.year,
        locationCategoryId: category.id,
        ratePerKare: r.amount,
        isActive: true,
        createdById: admin.id,
      },
    });
    rateMap.set(`${r.year}-${r.code}`, taxRate.id);
  }

  // Properties
  const propertyH001 = await prisma.property.create({
    data: {
      ownerId: ownerProfile1.id,
      houseNumber: "H-001",
      fileNumber: "F-001",
      landSizeKare: 400,
      locationCategoryId: categoryA.id,
      ownershipType: OwnershipType.LEASE,
      status: PropertyStatus.APPROVED,
      approvedById: manager.id,
      approvedAt: new Date(),
    },
  });

  const propertyH002 = await prisma.property.create({
    data: {
      ownerId: ownerProfile2.id,
      houseNumber: "H-002",
      fileNumber: "F-002",
      landSizeKare: 250,
      locationCategoryId: categoryB.id,
      ownershipType: OwnershipType.OLD_POSSESSION,
      status: PropertyStatus.APPROVED,
      approvedById: manager.id,
      approvedAt: new Date(),
    },
  });

  const propertyH003 = await prisma.property.create({
    data: {
      ownerId: ownerProfile1.id,
      houseNumber: "H-003",
      fileNumber: "F-003",
      landSizeKare: 300,
      ownershipType: OwnershipType.OTHER,
      status: PropertyStatus.SUBMITTED,
      locationDescription: "Pending worker category assignment",
    },
  });

  const propertyH004 = await prisma.property.create({
    data: {
      ownerId: ownerProfile2.id,
      houseNumber: "H-004",
      fileNumber: "F-004",
      landSizeKare: 180,
      locationCategoryId: categoryC.id,
      ownershipType: OwnershipType.LEASE,
      status: PropertyStatus.UNDER_REVIEW,
      reviewedById: worker.id,
      reviewedAt: new Date(),
    },
  });

  const propertyH005 = await prisma.property.create({
    data: {
      ownerId: ownerProfile1.id,
      houseNumber: "H-005",
      fileNumber: "F-005",
      landSizeKare: 200,
      locationCategoryId: categoryB.id,
      ownershipType: OwnershipType.OTHER,
      status: PropertyStatus.REJECTED,
      rejectionReason: "Missing valid file reference",
      reviewedById: worker.id,
      reviewedAt: new Date(),
    },
  });

  // Property documents
  const docs = [
    {
      propertyId: propertyH001.id,
      title: "Ownership Evidence",
      fileUrl: "/uploads/demo/ownership-evidence.pdf",
      fileName: "ownership-evidence.pdf",
      documentType: "OWNERSHIP_EVIDENCE",
      status: DocumentStatus.APPROVED,
      uploadedById: ownerUser1.id,
      reviewedById: worker.id,
      reviewedAt: new Date(),
    },
    {
      propertyId: propertyH001.id,
      title: "File Reference",
      fileUrl: "/uploads/demo/file-reference.pdf",
      fileName: "file-reference.pdf",
      documentType: "FILE_REFERENCE",
      status: DocumentStatus.APPROVED,
      uploadedById: ownerUser1.id,
      reviewedById: worker.id,
      reviewedAt: new Date(),
    },
    {
      propertyId: propertyH002.id,
      title: "Ownership Evidence",
      fileUrl: "/uploads/demo/ownership-evidence-h002.pdf",
      fileName: "ownership-evidence-h002.pdf",
      documentType: "OWNERSHIP_EVIDENCE",
      status: DocumentStatus.APPROVED,
      uploadedById: ownerUser2.id,
      reviewedById: worker.id,
      reviewedAt: new Date(),
    },
    {
      propertyId: propertyH002.id,
      title: "Kebele File Reference",
      fileUrl: "/uploads/demo/file-reference-h002.pdf",
      fileName: "file-reference-h002.pdf",
      documentType: "FILE_REFERENCE",
      status: DocumentStatus.APPROVED,
      uploadedById: ownerUser2.id,
      reviewedById: worker.id,
      reviewedAt: new Date(),
    },
    {
      propertyId: propertyH003.id,
      title: "Ownership Evidence",
      fileUrl: "/uploads/demo/ownership-evidence-h003.pdf",
      fileName: "ownership-evidence-h003.pdf",
      documentType: "OWNERSHIP_EVIDENCE",
      status: DocumentStatus.PENDING,
      uploadedById: ownerUser1.id,
    },
    {
      propertyId: propertyH004.id,
      title: "Ownership Evidence",
      fileUrl: "/uploads/demo/ownership-evidence-h004.pdf",
      fileName: "ownership-evidence-h004.pdf",
      documentType: "OWNERSHIP_EVIDENCE",
      status: DocumentStatus.PENDING,
      uploadedById: ownerUser2.id,
    },
    {
      propertyId: propertyH004.id,
      title: "ID Document",
      fileUrl: "/uploads/demo/id-document-h004.pdf",
      fileName: "id-document-h004.pdf",
      documentType: "ID_DOCUMENT",
      status: DocumentStatus.APPROVED,
      uploadedById: ownerUser2.id,
      reviewedById: worker.id,
      reviewedAt: new Date(),
    },
    {
      propertyId: propertyH005.id,
      title: "File Reference",
      fileUrl: "/uploads/demo/file-reference-h005.pdf",
      fileName: "file-reference-h005.pdf",
      documentType: "FILE_REFERENCE",
      status: DocumentStatus.REJECTED,
      uploadedById: ownerUser1.id,
      reviewedById: worker.id,
      reviewedAt: new Date(),
      rejectionReason: "Missing valid file reference",
    },
  ] as const;

  for (const d of docs) {
    await prisma.propertyDocument.create({
      data: {
        propertyId: d.propertyId,
        title: d.title,
        fileUrl: d.fileUrl,
        fileName: d.fileName,
        documentType: d.documentType,
        mimeType: "application/pdf",
        status: d.status,
        uploadedById: d.uploadedById,
        reviewedById: d.reviewedById ?? null,
        reviewedAt: d.reviewedAt ?? null,
        rejectionReason: d.rejectionReason ?? null,
      },
    });
  }

  // Assessments
  const rateAForCurrent = rateMap.get(`${currentYear}-A`);
  const rateBForCurrent = rateMap.get(`${currentYear}-B`);
  const rateAForPrevious = rateMap.get(`${previousYear}-A`);
  if (!rateAForCurrent || !rateBForCurrent || !rateAForPrevious) {
    throw new Error("Required tax rate records were not created");
  }

  const assessmentH001Paid = await prisma.taxAssessment.create({
    data: {
      propertyId: propertyH001.id,
      taxRateId: rateAForCurrent,
      taxYear: currentYear,
      landSizeKare: propertyH001.landSizeKare,
      ratePerKare: 5.0,
      baseAmount: 2000.0,
      penaltyAmount: 0,
      previousBalance: 0,
      totalAmount: 2000.0,
      status: AssessmentStatus.PAID,
      issuedById: manager.id,
      issuedAt: new Date(),
      note: "Demo paid assessment",
    },
  });

  const assessmentH002Issued = await prisma.taxAssessment.create({
    data: {
      propertyId: propertyH002.id,
      taxRateId: rateBForCurrent,
      taxYear: currentYear,
      landSizeKare: propertyH002.landSizeKare,
      ratePerKare: 3.5,
      baseAmount: 875.0,
      penaltyAmount: 0,
      previousBalance: 0,
      totalAmount: 875.0,
      status: AssessmentStatus.ISSUED,
      issuedById: manager.id,
      issuedAt: new Date(),
      note: "Demo issued unpaid assessment",
    },
  });

  await prisma.taxAssessment.create({
    data: {
      propertyId: propertyH001.id,
      taxRateId: rateAForPrevious,
      taxYear: previousYear,
      landSizeKare: propertyH001.landSizeKare,
      ratePerKare: 4.5,
      baseAmount: 1800.0,
      penaltyAmount: 150.0,
      previousBalance: 0,
      totalAmount: 1950.0,
      status: AssessmentStatus.CANCELLED,
      issuedById: manager.id,
      issuedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90),
      cancelledById: manager.id,
      cancelledAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
      cancellationReason: "Demo cancelled assessment",
    },
  });

  // Payments
  const verifiedPayment = await prisma.payment.create({
    data: {
      assessmentId: assessmentH001Paid.id,
      payerId: ownerUser1.id,
      method: PaymentMethod.SINQEE_BANK,
      status: PaymentStatus.VERIFIED,
      amount: assessmentH001Paid.totalAmount,
      paidAt: new Date(),
      referenceNumber: "SINQEE-DEMO-001",
      bankName: "Sinqee Bank",
      bankBranch: "Hermata Branch",
      receiptFileUrl: "/uploads/demo/sinqee-receipt.pdf",
      receiptFileName: "sinqee-receipt.pdf",
      verifiedById: worker.id,
      verifiedAt: new Date(),
    },
  });

  await prisma.payment.create({
    data: {
      assessmentId: assessmentH002Issued.id,
      payerId: ownerUser2.id,
      method: PaymentMethod.SINQEE_BANK,
      status: PaymentStatus.UNDER_REVIEW,
      amount: assessmentH002Issued.totalAmount,
      paidAt: new Date(),
      referenceNumber: "SINQEE-DEMO-002",
      bankName: "Sinqee Bank",
      bankBranch: "Hermata Branch",
      receiptFileUrl: "/uploads/demo/sinqee-receipt-pending.pdf",
      receiptFileName: "sinqee-receipt-pending.pdf",
    },
  });

  // Confirmation
  await prisma.kebeleConfirmation.create({
    data: {
      paymentId: verifiedPayment.id,
      confirmationNumber: `KHC-${currentYear}-000001`,
      status: ConfirmationStatus.ISSUED,
      issuedById: manager.id,
      issuedAt: new Date(),
      note: "Demo confirmation for paid property tax",
    },
  });

  console.log("Demo workflow seed completed.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
