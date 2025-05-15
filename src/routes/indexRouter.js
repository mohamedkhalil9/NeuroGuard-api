import { Router } from "express";
import authRoutes from "./authRoutes.js";
import adminRoutes from "./adminRoutes.js";
import patientRoutes from "./patientRoutes.js";
import doctorRoutes from "./doctorRotues.js";
import appointmentRoutes from "./appointmentRoutes.js";
import strokeRoutes from "./strokeRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/doctors", doctorRoutes);
router.use("/patients", patientRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/storke", strokeRoutes);

export default router;
