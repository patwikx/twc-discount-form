"use server";

import { prisma } from "@/lib/prisma";
import { sendApprovalRequest } from "@/lib/email";
import { revalidatePath } from "next/cache";

export type DiscountFormData = {
  employeeType: string;
  name: string;
  idNumber: string;
  companyId: string; // The UUID from database
  department: string;
  position: string;
  availmentDate: Date;
  phoneNumber: string;
  email: string; // Employee email for notifications
  hotel: string[]; // Array of strings for checkbox
  discountType: string[]; // Array of strings
};

export async function submitApplication(data: DiscountFormData) {
  // 1. Lookup Company from Database
  const company = await prisma.company.findUnique({
    where: { id: data.companyId },
  });

  if (!company) {
    throw new Error("Invalid Company Selected");
  }

  // 2. Create Record
  const application = await prisma.discountApplication.create({
    data: {
      employeeType: data.employeeType,
      name: data.name,
      idNumber: data.idNumber,
      companyId: company.id,
      approverEmail: company.approverEmail,
      department: data.department,
      position: data.position,
      availmentDate: data.availmentDate,
      phoneNumber: data.phoneNumber,
      email: data.email,
      hotel: data.hotel.join(", "),
      discountType: data.discountType.join(", "),
      status: "PENDING",
    },
  });

  // 3. Send Email
  if (process.env.RESEND_API_KEY) {
    await sendApprovalRequest(
      company.approverEmail,
      data.name,
      application.id,
      {
        company: company.name,
        department: data.department,
        position: data.position,
        hotel: data.hotel.join(", "),
        discountType: data.discountType.join(", "),
        availmentDate: data.availmentDate.toLocaleDateString(),
      }
    );
  } else {
    console.warn("RESEND_API_KEY missing, skipping email.");
  }

  // 4. Return ID for client redirect
  return { success: true, id: application.id };
}

export async function getApplication(id: string) {
  return await prisma.discountApplication.findUnique({
    where: { id },
    include: { company: true },
  });
}

export async function approveApplication(id: string, approverName: string) {
  const application = await prisma.discountApplication.update({
    where: { id },
    data: { status: "APPROVED" },
    include: { company: true },
  });

  // Send approval notification email to employee
  if (process.env.RESEND_API_KEY && application.email) {
    const { sendApplicationStatus } = await import("@/lib/email");
    await sendApplicationStatus(
      application.email,
      application.name,
      application.id,
      "APPROVED",
      {
        company: application.company?.name,
        hotel: application.hotel,
        discountType: application.discountType,
        availmentDate: application.availmentDate.toLocaleDateString(),
        qrToken: application.qrToken,
      }
    );
  }

  revalidatePath(`/status/${id}`);
  revalidatePath(`/admin/approve/${id}`);
}

export async function rejectApplication(id: string) {
  const application = await prisma.discountApplication.update({
    where: { id },
    data: { status: "REJECTED" },
    include: { company: true },
  });

  // Send rejection notification email to employee
  if (process.env.RESEND_API_KEY && application.email) {
    const { sendApplicationStatus } = await import("@/lib/email");
    await sendApplicationStatus(
      application.email,
      application.name,
      application.id,
      "REJECTED"
    );
  }

  revalidatePath(`/status/${id}`);
  revalidatePath(`/admin/approve/${id}`);
}

export async function validateToken(token: string) {
    const app = await prisma.discountApplication.findUnique({
        where: { qrToken: token },
        include: { company: true }
    });
    return app;
}

export async function redeemToken(id: string) {
    await prisma.discountApplication.update({
        where: { id },
        data: {
            status: "USED",
            usedAt: new Date()
        }
    });
    revalidatePath(`/scan`);
    revalidatePath(`/status/${id}`);
}
