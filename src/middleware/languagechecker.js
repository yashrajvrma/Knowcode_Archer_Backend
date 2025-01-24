import cld3 from "cld3-asm";

export const languageChecker = async (req, res, next) => {
  try {
    const { text, sourceLang } = req.query;

    if (!text || !sourceLang) {
      return res
        .status(400)
        .json({ error: "Text and sourceLang are required" });
    }

    // Detect language
    const result = await cld3.getLanguages(text);

    if (!result || result.length === 0) {
      return res.status(400).json({ error: "Unable to detect language" });
    }

    const detectedLanguage = result[0].language; // The most likely detected language

    if (detectedLanguage !== sourceLang) {
      return res.status(400).json({
        error: `The text appears to be in '${detectedLanguage}' but you stated '${sourceLang}'.`,
      });
    }

    // Pass detected language to the next middleware
    req.detectedLanguage = detectedLanguage;
    next();
  } catch (error) {
    res
      .status(500)
      .json({ error: "Language detection failed", details: error.message });
  }
};
