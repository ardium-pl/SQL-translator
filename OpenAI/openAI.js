import OpenAI from "openai";
import dotenv from "dotenv";
import { loggerOpenAI } from "../Utils/logger.js";

dotenv.config();

const openai = new OpenAI();

export async function generateGPTAnswer(prompt) {
  try {
    const response = await openai.chat.completions.create({
      messages: prompt,
      model: "gpt-4o-mini",
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    loggerOpenAI.error(error);
  }
}

