import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import dotenv from "dotenv";

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

function assertResetIsSafe() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Refusing demo seed reset in production");
  }

  if (process.env.ALLOW_SEED_RESET !== "true") {
    throw new Error("Refusing demo seed reset because ALLOW_SEED_RESET is not true");
  }
}

async function resetDemoOwnedData() {
  const demoUsers = await prisma.user.findMany({
    where: { email: { in: [...DEMO_EMAILS] } },
    select: { id: true },
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

  await prisma.kebeleConfirmation.deleteMany({
    where: {
      OR: [{ paymentId: { in: demoPaymentIds } }, { confirmationNumber: { startsWith: "KHC-" } }],
    },
  });

  await prisma.payment.deleteMany({ where: { id: { in: demoPaymentIds } } });
  await prisma.taxAssessment.deleteMany({ where: { id: { in: demoAssessmentIds } } });
  await prisma.propertyDocument.deleteMany({
    where: {
      OR: [{ propertyId: { in: demoPropertyIds } }, { fileUrl: { contains: "/uploads/demo/" } }],
    },
  });
  await prisma.property.deleteMany({ where: { id: { in: demoPropertyIds } } });
  await prisma.houseOwnerProfile.deleteMany({ where: { id: { in: demoOwnerIds } } });
  await prisma.user.deleteMany({ where: { id: { in: demoUserIds } } });
}

async function main() {
  assertResetIsSafe();
  await resetDemoOwnedData();
  console.log("Demo-owned records removed successfully.");
}

main()
  .catch((error) => {
    console.error("Demo seed reset failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
