import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { serviceService } from "./service.service";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";

const getAllServices = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { type, rating } = req.query;

    const filters = {
      type: type as string,
      rating: rating ? Number(rating) : undefined,
    };

    const result = await serviceService.getAllServicesFromDB(filters);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Services retrieved successfully",
      data: result,
    });
  },
);

export const serviceController = {
  getAllServices,
};
