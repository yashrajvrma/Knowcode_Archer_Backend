import OpenAI from "openai";
import express from "express";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

const app = express();
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const textTranslateAndConvertIntoSpeech = async (req, res) => {
  const { sourceLang, targetLang, text } = req.query;

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

    const speechFile = path.resolve("./speech.mp3");

    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: translatedText,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(speechFile, buffer);

    // Return the translated text
    return res.json({ translatedText });
  } catch (error) {
    console.error("Error during translation:", error.message);
    return res.status(500).json({ error: "Error processing translation" });
  }
};
