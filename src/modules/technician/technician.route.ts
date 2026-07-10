import { Router } from "express";
import { technicianController } from "./technician.controller";
import { Role } from "../../../generated/prisma/client";
import { auth } from "../../middlewares/auth";

const router = Router();

// router.get("/", technicianController.getAllTechnicians);
// router.get("/:id", technicianController.getTechnicianById);
router.put(
  "/profile",
  auth(Role.Technician),
  technicianController.updateTechnicianProfile,
);
router.post(
  "/services",
  auth("Technician"),
  technicianController.createService,
);
router.put(
  "/services/:id",
  auth("Technician"),
  technicianController.updateService,
);

router.post(
  "/availability",
  auth("Technician"),
  technicianController.createAvailability,
);
router.put(
  "/availability/:id",
  auth("Technician"),
  technicianController.updateAvailability,
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

export const technicianRoutes = router;
