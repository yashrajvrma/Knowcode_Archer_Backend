import express from "express";
import { textTranslateAndConvertIntoSpeech } from "../controllers/translate/translate.controllers.js";
import { languageChecker } from "../middleware/languagechecker.js";

const router = express.Router();

router.route("/translate-lang").get(textTranslateAndConvertIntoSpeech);

export default router;
