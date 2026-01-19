"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ============= HOTELS =============

// Get all active hotels (for form dropdown)
export async function getHotels() {
  return await prisma.hotel.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
}

// Get all hotels (including inactive, for admin)
export async function getAllHotels() {
  return await prisma.hotel.findMany({
    orderBy: [{ isActive: "desc" }, { name: "asc" }],
  });
}

// Get single hotel by ID
export async function getHotelById(id: string) {
  return await prisma.hotel.findUnique({ where: { id } });
}

// Create hotel
export async function createHotel(data: { name: string }) {
  const hotel = await prisma.hotel.create({ data });
  revalidatePath("/admin/hotels");
  return hotel;
}

// Update hotel
export async function updateHotel(id: string, data: { name: string; isActive?: boolean }) {
  const hotel = await prisma.hotel.update({ where: { id }, data });
  revalidatePath("/admin/hotels");
  return hotel;
}

// Delete (deactivate) hotel
export async function deleteHotel(id: string) {
  await prisma.hotel.update({ where: { id }, data: { isActive: false } });
  revalidatePath("/admin/hotels");
}

// Restore hotel
export async function restoreHotel(id: string) {
  await prisma.hotel.update({ where: { id }, data: { isActive: true } });
  revalidatePath("/admin/hotels");
}

// ============= DISCOUNT TYPES =============

// Get all active discount types (for form dropdown)
export async function getDiscountTypes() {
  return await prisma.discountType.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
}

// Get all discount types (including inactive, for admin)
export async function getAllDiscountTypes() {
  return await prisma.discountType.findMany({
    orderBy: [{ isActive: "desc" }, { name: "asc" }],
  });
}

// Get single discount type by ID
export async function getDiscountTypeById(id: string) {
  return await prisma.discountType.findUnique({ where: { id } });
}

// Create discount type
export async function createDiscountType(data: { name: string }) {
  const discountType = await prisma.discountType.create({ data });
  revalidatePath("/admin/discount-types");
  return discountType;
}

// Update discount type
export async function updateDiscountType(id: string, data: { name: string; isActive?: boolean }) {
  const discountType = await prisma.discountType.update({ where: { id }, data });
  revalidatePath("/admin/discount-types");
  return discountType;
}

// Delete (deactivate) discount type
export async function deleteDiscountType(id: string) {
  await prisma.discountType.update({ where: { id }, data: { isActive: false } });
  revalidatePath("/admin/discount-types");
}

// Restore discount type
export async function restoreDiscountType(id: string) {
  await prisma.discountType.update({ where: { id }, data: { isActive: true } });
  revalidatePath("/admin/discount-types");
}
