import { Router } from "express";
import { technicianController } from "./technician.controller";

const router = Router();

router.get("/", technicianController.getAllTechnicians);
router.get("/:id", technicianController.getTechnicianById);

export const technicianRoutes = router;
