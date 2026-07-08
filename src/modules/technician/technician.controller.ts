import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { technicianService } from "./technician.service";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";

const getAllTechnicians = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { type, location, rating } = req.query;

    const filters = {
      type: type as string | undefined,
      location: location as string | undefined,
      rating: rating ? Number(rating) : undefined,
    };

    const result = await technicianService.getAllTechniciansFromDB(filters);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Technicians retrieved successfully",
      data: result,
    });
  },
);

const getTechnicianById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await technicianService.getTechnicianByIdFromDB(id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Technician profile retrieved successfully",
      data: result,
    });
  },
);

export const technicianController = {
  getAllTechnicians,
  getTechnicianById,
};
