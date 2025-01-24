import OpenAI from "openai";
import express from "express";
const app = express();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const translateText = async (req, res) => {
  const { sourceLang, targetLang, text } = req.query;
  console.log(sourceLang);
  console.log(targetLang);
  console.log(text);

  if (!sourceLang || !text || !targetLang) {
    return res.status(400).json({ error: "Missing sourceLang or text" });
  }

  try {
    // Create a chat completion with OpenAI for translation
    const completion = await openai.chat.completions.create({
      model: "gpt-4", // Use the appropriate model
      messages: [
        {
          role: "system",
          content: `You are a language translator expert. Translate the given text into ${targetLang} with maximum accuracy.`,
        },
        {
          role: "user",
          content: `Translate this text into ${targetLang}: "${text}"`,
        },
      ],
      store: true,
    });

    // Extract the translated text from the response
    const translatedText = completion.choices[0].message.content;
    console.log("translated text" + translatedText);

    // Return the translated text
    return res.json({ translatedText });
  } catch (error) {
    console.error("Error during translation:", error.message);
    return res.status(500).json({ error: "Error processing translation" });
  }
};
  