import { PrismaClient } from "@prisma/client"
import { randomUUID } from "node:crypto"

const prisma = new PrismaClient()

async function main() {
  let org = await prisma.organization.findFirst()
  if (!org) {
    org = await prisma.organization.create({
      data: {
        id: randomUUID(),
        name: "Default Organization",
        slug: `default-${randomUUID().slice(0, 8)}`,
      },
    })
    console.log("Organisation angelegt:", org.id)
  }

  const website = "https://ibs.de"
  const existing = await prisma.client.findFirst({
    where: { companyName: "IBS", website },
  })
  if (existing) {
    console.log("Testkunde existiert bereits:", existing.id, existing.companyName)
    return
  }

  await prisma.client.create({
    data: {
      organizationId: org.id,
      companyName: "IBS",
      industry: "Sicherheitstechnik",
      contactName: "David Viu",
      website,
      notes: "Testkunde (Prisma Seed)",
    },
  })

  console.log("Testkunde IBS angelegt (Kontakt: David Viu, Branche: Sicherheitstechnik).")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
