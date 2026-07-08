import { prisma } from "../../lib/prisma";
import type { IServiceFilters } from "./service.interface";

const getAllServicesFromDB = async (filters: IServiceFilters) => {
  const { type, rating } = filters;

  const result = await prisma.service.findMany({
    where: {
      category: type
        ? {
            name: {
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
  });

  return result;
};

export const serviceService = {
  getAllServicesFromDB,
};
