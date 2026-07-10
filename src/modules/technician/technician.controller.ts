import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { technicianProfile } from "./technician.service";
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

    const result = await technicianProfile.getAllTechniciansFromDB(filters);

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

    const result = await technicianProfile.getTechnicianByIdFromDB(id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Technician profile retrieved successfully",
      data: result,
    });
  },
);

const updateTechnicianProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const payload = req.body;

    const result = await technicianProfile.updateTechnicianProfileInDB(
      userId,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Technician profile updated successfully",
      data: result,
    });
  },
);

const getTechnicianBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const technicianId = req.user?.id as string;

    const result =
      await technicianProfile.getTechnicianBookingsFromDB(technicianId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Technician bookings retrieved successfully",
      data: result,
    });
  },
);

const updateBookingStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const technicianId = req.user?.id as string;
    const payload = req.body;

    const result = await technicianProfile.updateBookingStatusInDB(
      id as string,
      technicianId,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Booking status updated successfully",
      data: result,
    });
  },
);

export const technicianController = {
  getAllTechnicians,
  getTechnicianById,
  updateBookingStatus,
  updateTechnicianProfile,
  getTechnicianBookings,
};
