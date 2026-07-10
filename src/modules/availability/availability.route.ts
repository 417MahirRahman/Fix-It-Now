import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { availabilityController } from "./availability.controller";

const router = Router();

router.post(
  "/availability",
  auth(Role.Technician),
  availabilityController.createAvailability,
);
router.put(
  "/availability/:id",
  auth(Role.Technician),
  availabilityController.updateAvailability,
);

export const availabilityRoutes = router;
