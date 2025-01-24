// import OpenAI from "openai";
// import express from "express";
// import dotenv from "dotenv";

// dotenv.config();

// const app = express();

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export const textTranslateAndConvertIntoSpeech = async (req, res) => {
//   const { sourceLang, targetLang, text } = req.query;

//   if (!sourceLang || !text || !targetLang) {
//     return res
//       .status(400)
//       .json({ error: "Missing sourceLang, text, or targetLang" });
//   }

//   try {
//     // Create a chat completion with OpenAI for translation
//     const completion = await openai.chat.completions.create({
//       model: "gpt-4",
//       messages: [
//         {
//           role: "system",
//           content: `You are a language translator expert. Translate the given text into ${targetLang} with maximum accuracy.`,
//         },
//         {
//           role: "user",
//           content: `Translate this text into ${targetLang}: "${text}"`,
//         },
//       ],
//     });

//     const translatedText = completion.choices[0].message.content;

//     // Generate audio using OpenAI TTS API
//     const mp3 = await openai.audio.speech.create({
//       model: "tts-1",
//       voice: "alloy",
//       input: translatedText,
//     });

//     // Stream the audio to the frontend
//     res.set({
//       "Content-Type": "audio/mpeg",
//       "Content-Disposition": "inline",
//     });

//     const buffer = Buffer.from(await mp3.arrayBuffer());
//     res.end(buffer);
//   } catch (error) {
//     console.error(
//       "Error during translation or audio generation:",
//       error.message
//     );
//     res
//       .status(500)
//       .json({ error: "Error processing translation or streaming audio" });
//   }
// };

import OpenAI from "openai";
import express from "express";
import dotenv from "dotenv";
import { Readable } from "stream";

dotenv.config();

const router = express.Router();

// Initialize OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const textTranslateAndConvertIntoSpeech = async (req, res) => {
  const { sourceLang, targetLang, text } = req.query;

  if (!sourceLang || !text || !targetLang) {
    return res
      .status(400)
      .json({ error: "Missing sourceLang, text, or targetLang" });
  }

  try {
    // Translate text using GPT-4
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
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
    });

    const translatedText = completion.choices[0].message.content;

    // Convert translated text to speech
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: translatedText,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());

    // Set response headers for streaming audio
    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Disposition": "inline",
    });

    // Stream audio data
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null); // Signal end of stream
    readable.pipe(res);
  } catch (error) {
    console.error(
      "Error during translation or audio generation:",
      error.message
    );
    res
      .status(500)
      .json({ error: "Error processing translation or streaming audio" });
  }
};
