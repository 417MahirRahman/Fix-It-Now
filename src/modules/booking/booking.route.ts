import { Router } from "express";
import { bookingController } from "./booking.controller";

const router = Router();

router.post("/", bookingController.createBooking); 
router.get("/", bookingController.getMyBookings); 
router.get("/:id", bookingController.getBookingById);

export const bookingRoutes = router;
