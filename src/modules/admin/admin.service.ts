import { prisma } from "../../lib/prisma";
import type { IUpdateUserStatus, ICreateCategory } from "./admin.interface";

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

const getAllBookingsFromDB = async () => {
  const result = await prisma.booking.findMany({
    include: {
      customer: { select: { name: true, email: true } },
      technician: { select: { name: true, email: true } },
      service: { select: { title: true, price: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return result;
};

const getAllCategoriesFromDB = async () => {
  const result = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
  });

  return result;
};

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
