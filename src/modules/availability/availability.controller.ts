import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";
import { availabilityService } from "./availability.service";

const createAvailability = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const payload = req.body;

    const result = await availabilityService.createAvailabilityIntoDB(
      userId,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Availability slot added successfully",
      data: result,
    });
  },
);

const updateAvailability = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const { id } = req.params;
    const payload = req.body;

    const result = await availabilityService.updateAvailabilityInDB(
      userId,
      id as string,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Availability slot updated successfully",
      data: result,
    });
  },
);

export const availabilityController = {
  createAvailability,
  updateAvailability,
};