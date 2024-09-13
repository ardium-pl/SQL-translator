import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI();

export async function generateGPTAnswer(messages) {
  try {
    const response = await openai.chat.completions.create({
      messages: messages,
      model: "gpt-4o-mini",
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("❌ Error calling OpenAI:", error);
  }
}

