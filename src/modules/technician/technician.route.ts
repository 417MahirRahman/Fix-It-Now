import { Router } from "express";
import { technicianController } from "./technician.controller";
import { Role } from "../../../generated/prisma/enums";
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

router.post(
  "/services",
  auth(Role.Technician),
  technicianController.createService,
);
router.put(
  "/services/:id",
  auth(Role.Technician),
  technicianController.updateService,
);

router.post(
  "/availability",
  auth(Role.Technician),
  technicianController.createAvailability,
);
router.put(
  "/availability/:id",
  auth(Role.Technician),
  technicianController.updateAvailability,
);

router.get("/:id", technicianController.getTechnicianById);

router.delete(
  "/services/:id",
  auth(Role.Technician),
  technicianController.deleteService,
);

export const technicianRoutes = router;
