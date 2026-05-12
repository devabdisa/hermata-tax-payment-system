/**
 * Suggested Seed Data for Location Categories and Tax Rates.
 * DO NOT run this automatically. Real values must be entered by authorized kebele managers.
 * 
 * Location Categories:
 * 1. Code: A
 *    Name: City Center / Main Road
 *    Description: Higher-value area close to town center, main road, or commercial activity
 *    Level/Priority: 1
 * 
 * 2. Code: B
 *    Name: Developed Residential Area
 *    Description: Residential area near town or developed services
 *    Level/Priority: 2
 * 
 * 3. Code: C
 *    Name: Inner Village / Less Developed Area
 *    Description: Lower-value area farther from town center
 *    Level/Priority: 3
 * 
 * Tax Rates (Example ONLY - Do not use real government values without authorization):
 * - Year: 2024, Category: A, Rate Per Kare: 150.00
 * - Year: 2024, Category: B, Rate Per Kare: 100.00
 * - Year: 2024, Category: C, Rate Per Kare: 50.00
 * 
 * Note: Actual rates must be entered by authorized manager based on official kebele rules.
 */

// Example Prisma script (commented out):
/*
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const catA = await prisma.locationCategory.upsert({
    where: { code: 'A' },
    update: {},
    create: { name: 'City Center / Main Road', code: 'A', priority: 1 },
  })
  // ... create B and C

  await prisma.taxRate.upsert({
    where: { taxYear_locationCategoryId: { taxYear: 2024, locationCategoryId: catA.id } },
    update: {},
    create: { taxYear: 2024, locationCategoryId: catA.id, ratePerKare: 150.00, createdById: 'admin-id' },
  })
}
*/
