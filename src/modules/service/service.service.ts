import { prisma } from "../../lib/prisma";
import { ICreateService, IServiceFilters, IUpdateService } from "./service.interface";

// Get all services from the database with filters
const getAllServicesFromDB = async (filters: IServiceFilters) => {
  const { type, rating } = filters;

  const result = await prisma.service.findMany({
    where: {
      category: type
        ? {
            category_name: {
              equals: type,
              mode: "insensitive",
            },
          }
        : undefined,
      rating: rating
        ? {
            gte: Number(rating),
          }
        : undefined,
    },
    include: {
      category: true,
      technician: {
        include: {
          user: {
            select: {
              name: true,
              phone: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return result;
};

// Create Service in the database
const createServiceIntoDB = async (userId: string, payload: ICreateService) => {
  const technicianProfile = await prisma.technicianProfile.findUniqueOrThrow({
    where: { userId },
  });

  const category = await prisma.category.findUniqueOrThrow({
    where: { category_name: payload.categoryName },
  });

  const result = await prisma.service.create({
    data: {
      technicianId: technicianProfile.id,
      service_name: payload.service_name,
      price: payload.price,
      categoryId: category.id,
    },
  });

  return result;
};

// Update Service in the database
const updateServiceInDB = async (
  userId: string,
  serviceId: string,
  payload: IUpdateService,
) => {
  const technicianProfile = await prisma.technicianProfile.findUniqueOrThrow({
    where: { userId },
  });

  const existingService = await prisma.service.findFirstOrThrow({
    where: { id: serviceId, technicianId: technicianProfile.id },
  });

  const result = await prisma.service.update({
    where: { id: existingService.id },
    data: payload,
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

export const technicianService = {
  getAllServicesFromDB,
  createServiceIntoDB,
  updateServiceInDB,
  getAllCategoriesFromDB,
};
