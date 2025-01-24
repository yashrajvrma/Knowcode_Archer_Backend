import express from "express";
const bodyParser = require("body-parser");
const { Translate } = require("@google-cloud/translate").v2;

const app = express();
app.use(bodyParser.json());

const translate = new Translate();

app.use(async (req, res, next) => {
  try {
    const { text, targetLanguage } = req.body;

    if (!text || !targetLanguage) {
      return res
        .status(400)
        .json({ error: "text and targetLanguage are required" });
    }
    const [translation] = await translate.translate(text, targetLanguage);
    req.translatedText = translation;

    next();
  } catch (error) {
    res
      .status(500)
      .json({ error: "Translation failed", details: error.message });
  }
});

app.post("/translate", (req, res) => {
  // Send the translated text as a response
  res.json({ originalText: req.body.text, translatedText: req.translatedText });
});
