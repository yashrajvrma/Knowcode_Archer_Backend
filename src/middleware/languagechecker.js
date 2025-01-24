import bodyParser from "body-parser";
const { Translate } = require("@google-cloud/translate").v2;

app.use(bodyParser.json());

const translate = new Translate();

app.use(async (req, res, next) => {
  try {
    const { text, sourceLanguage } = req.query;

    if (!text || !sourceLanguage) {
      return res
        .status(400)
        .json({ error: "text and sourceLanguage are required" });
    }
    const [translation] = await translate.translate(text, sourceLanguage);
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
