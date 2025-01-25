import LanguageDetect from "languagedetect";
const lngDetector = new LanguageDetect();

export const languageChecker = (req, res, next) => {
  try {
    const { text, sourceLang } = req.body;

    if (!text || !sourceLang) {
      return res
        .status(400)
        .json({ error: "Text and stated language are required." });
    }

    const detectedLanguages = lngDetector.detect(text, 1);
    if (detectedLanguages.length === 0) {
      return res.status(400).json({ error: "Unable to detect the language." });
    }

    const [detectedLanguage, maxProbability] = detectedLanguages[0];

    if (sourceLang.toLowerCase() === detectedLanguage.toLowerCase()) {
      console.log(
        `Language matched: ${detectedLanguage} (Probability: ${maxProbability})`
      );
      return next();
    } else {
      console.log(
        `Mismatch: Stated (${sourceLang}) vs Detected (${detectedLanguage})`
      );
      return res.status(400).json({
        error:
          "Stated language does not match detected language, Please give the correct language",
      });
    }
  } catch (error) {
    console.error("Error in language middleware:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
