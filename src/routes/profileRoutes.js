import { Router } from "express";
import {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  uploadProfileImg,
} from "../controllers/profileController.js";
import upload from "../middlewares/multer.js";

const router = Router();

router
  .route("/")
  .get(getUserProfile)
  .patch(updateUserProfile)
  .delete(deleteUserProfile);

router.route("/upload").post(upload.single("image"), uploadProfileImg);

export default router;
