import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";
import { technicianService } from "./service.service";

const getAllServices = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { type, rating } = req.query;

    const filters = {
      type: type as string,
      rating: rating ? Number(rating) : undefined,
    };

    const result = await technicianService.getAllServicesFromDB(filters);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Services retrieved successfully",
      data: result,
    });
  },
);

const createService = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const payload = req.body;

    const result = await technicianService.createServiceIntoDB(userId, payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Service created successfully",
      data: result,
    });
  },
);

const updateService = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const { id } = req.params;
    const payload = req.body;

    const result = await technicianService.updateServiceInDB(
      userId,
      id as string,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Service updated successfully",
      data: result,
    });
  },
);

const getAllCategories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await technicianService.getAllCategoriesFromDB();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Categories retrieved successfully",
      data: result,
    });
  },
);

export const serviceController = {
  getAllServices,
  createService,
  updateService,
  getAllCategories
};
