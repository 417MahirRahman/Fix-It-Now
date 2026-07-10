import { prisma } from "../../lib/prisma";
import type { IUpdateUserStatus, ICreateCategory } from "./admin.interface";

// Get all users from the database
const getAllUsersFromDB = async () => {
  const result = await prisma.users.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      phone: true,
      address: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return result;
};

// Update user status in the database
const updateUserStatusInDB = async (id: string, payload: IUpdateUserStatus) => {
  const result = await prisma.users.update({
    where: { id },
    data: { status: payload.status },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });

  return result;
};

// Get all bookings from the database
const getAllBookingsFromDB = async () => {
  const result = await prisma.booking.findMany({
    include: {
      customer: { select: { name: true, email: true, phone: true } },
      technician: { select: { name: true, email: true, phone: true } },
      service: { select: { service_name: true, price: true } },
      payment: true,
      review: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return result;
};

// Get all categories from the database
const getAllCategoriesFromDB = async () => {
  const result = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
  });

  return result;
};

// Create a new category in the database
const createCategoryIntoDB = async (payload: ICreateCategory) => {
  const result = await prisma.category.create({
    data: payload,
  });

  return result;
};

export const adminService = {
  getAllUsersFromDB,
  updateUserStatusInDB,
  getAllBookingsFromDB,
  getAllCategoriesFromDB,
  createCategoryIntoDB,
};
