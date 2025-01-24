import express from "express";
import { translateLang } from "../controllers/translate/translate.controllers.js";

const router = express.Router();

router.route("/translate-lang").get(translateLang);

export default router;
