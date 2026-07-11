import { Router } from "express";
import { serviceController } from "./service.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get("/", serviceController.getAllServices);
router.post(
  "/",
  auth(Role.Technician),
  serviceController.createService,
);
router.put(
  "/:id",
  auth(Role.Technician),
  serviceController.updateService,
);
router.get(
  "/categories",
  serviceController.getAllCategories
);

export const serviceRoutes = router;
