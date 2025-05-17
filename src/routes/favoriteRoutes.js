import { Router } from "express";
import {
  toggleFavoriteDoctor,
  getFavoriteDoctors,
} from "../controllers/favoriteController.js";

const router = Router();

router.route("/").get(getFavoriteDoctors).patch(toggleFavoriteDoctor);

export default router;
