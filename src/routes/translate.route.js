import express from "express";
import { translateLang } from "../controllers/translate/translate.controllers.js";
import { translateText } from "../middleware/translateText.js";

const router = express.Router();

// router.route("/translate-lang").get(translateLang);
router.route("/translate-lang").get(translateText);

export default router;
