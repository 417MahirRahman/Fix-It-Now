import { Router } from "express";
import { bookingController } from "./booking.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", auth(Role.Customer), bookingController.createBooking); 
router.get("/", auth(Role.Customer), bookingController.getMyBookings); 
router.get("/:id", auth(Role.Customer), bookingController.getBookingById);

export const bookingRoutes = router;
