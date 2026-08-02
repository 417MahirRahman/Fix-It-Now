import { prisma } from "../../lib/prisma";
import type { IUpdateUserStatus, ICreateCategory, IAdminStatistics } from "./admin.interface";

// Get all users from the database
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

export const adminService = {
  getAllUsersFromDB,
  updateUserStatusInDB,
  getAllBookingsFromDB,
  getAllCategoriesFromDB,
  createCategoryIntoDB,
  getStatisticsFromDB,
};
