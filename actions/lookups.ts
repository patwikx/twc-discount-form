"use server";

import { prisma } from "@/lib/prisma";

// Get all active hotels
export async function getHotels() {
  return await prisma.hotel.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
}

// Get all active discount types
export async function getDiscountTypes() {
  return await prisma.discountType.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
}
