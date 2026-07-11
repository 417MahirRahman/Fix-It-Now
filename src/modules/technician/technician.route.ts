import { Router } from "express";
import { technicianController } from "./technician.controller";
import { Role } from "../../../generated/prisma/client";
import { auth } from "../../middlewares/auth";

const router = Router();

router.get("/", technicianController.getAllTechnicians);
router.put(
  "/profile",
  auth(Role.Technician),
  technicianController.updateTechnicianProfile,
);

router.get(
  "/bookings",
  auth(Role.Technician),
  technicianController.getTechnicianBookings,
);
router.patch(
  "/bookings/:id",
  auth(Role.Technician),
  technicianController.updateBookingStatus,
);
router.get("/:id", technicianController.getTechnicianById);

export const technicianRoutes = router;
