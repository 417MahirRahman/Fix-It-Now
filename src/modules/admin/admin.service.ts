import { prisma } from "../../lib/prisma";
import type {
  IUpdateUserStatus,
  ICreateCategory,
  IAdminStatistics,
} from "./admin.interface";

const getAllUsersFromDB = async () => {
  const result = await prisma.users.findMany({
    where: {
      role: {
        in: ["Customer", "Technician"],
      },
    },
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

const getStatisticsFromDB = async (): Promise<IAdminStatistics> => {
  const [
    totalUsers,
    totalCustomers,
    totalTechnicians,
    totalBookings,
    bookingsGrouped,
    totalCategories,
    revenueAggregate,
    totalPayments,
  ] = await Promise.all([
    prisma.users.count({ where: { role: { in: ["Customer", "Technician"] } } }),
    prisma.users.count({ where: { role: "Customer" } }),
    prisma.users.count({ where: { role: "Technician" } }),
    prisma.booking.count(),
    prisma.booking.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
    prisma.category.count(),
    prisma.payment.aggregate({
      where: { status: "Paid" },
      _sum: { amount: true },
    }),
    prisma.payment.count(),
  ]);

  const bookingsByStatus: Record<string, number> = {};
  bookingsGrouped.forEach((group) => {
    bookingsByStatus[group.status] = group._count.status;
  });

  return {
    totalUsers,
    totalCustomers,
    totalTechnicians,
    totalBookings,
    bookingsByStatus,
    totalCategories,
    totalRevenue: Number(revenueAggregate._sum.amount ?? 0),
    totalPayments,
  };
};

const deleteCategoryFromDB = async (id: string) => {
  const existingCategory = await prisma.category.findUnique({
    where: { id },
    include: { services: true },
  });

  if (!existingCategory) {
    throw new Error("Category not found");
  }

  if (existingCategory.services.length > 0) {
    throw new Error(
      "This category has services linked to it and cannot be deleted",
    );
  }

  const result = await prisma.category.delete({
    where: { id },
  });

  return result;
};

export const adminService = {
  getAllUsersFromDB,
  updateUserStatusInDB,
  getAllBookingsFromDB,
  getAllCategoriesFromDB,
  createCategoryIntoDB,
  getStatisticsFromDB,
  deleteCategoryFromDB,
};
