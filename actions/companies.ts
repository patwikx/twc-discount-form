"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type CompanyFormData = {
  name: string;
  approverEmail: string;
};

// Get all active companies
export async function getCompanies() {
  return await prisma.company.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
}

// Get all companies including inactive (for admin)
export async function getAllCompanies() {
  return await prisma.company.findMany({
    orderBy: { createdAt: "desc" },
  });
}

// Get single company by ID
export async function getCompanyById(id: string) {
  return await prisma.company.findUnique({
    where: { id },
  });
}

// Create new company
export async function createCompany(data: CompanyFormData) {
  const company = await prisma.company.create({
    data: {
      name: data.name,
      approverEmail: data.approverEmail,
    },
  });
  revalidatePath("/admin/companies");
  return company;
}

// Update company
export async function updateCompany(id: string, data: CompanyFormData) {
  const company = await prisma.company.update({
    where: { id },
    data: {
      name: data.name,
      approverEmail: data.approverEmail,
    },
  });
  revalidatePath("/admin/companies");
  return company;
}

// Soft delete company (set inactive)
export async function deleteCompany(id: string) {
  await prisma.company.update({
    where: { id },
    data: { isActive: false },
  });
  revalidatePath("/admin/companies");
}

// Restore company
export async function restoreCompany(id: string) {
  await prisma.company.update({
    where: { id },
    data: { isActive: true },
  });
  revalidatePath("/admin/companies");
}

// Seed initial companies from static config
export async function seedCompanies() {
  const companies = [
    { name: "Anchor Hotel", approverEmail: "plmiranda@rdrealty.com.ph" },
    { name: "Dolores Tropicana Resort", approverEmail: "manager@dolorestropicana.ph" },
    { name: "Dolores Farm Resort", approverEmail: "manager@doloresfarm.ph" },
    { name: "Dolores Lake Resort", approverEmail: "manager@doloreslake.ph" },
  ];

  for (const company of companies) {
    await prisma.company.upsert({
      where: { name: company.name },
      update: { approverEmail: company.approverEmail },
      create: company,
    });
  }

  revalidatePath("/admin/companies");
  return { success: true, count: companies.length };
}
