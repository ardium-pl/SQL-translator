import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import dotenv from "dotenv";
import { loggerOpenAI } from "../Utils/logger.js";

dotenv.config();

const openai = new OpenAI();

export const sqlResponse = z.object({
  isTranslatable: z.boolean(),
  isSelect: z.boolean(),
  sqlStatement: z.string(),
});

export const finalResponse = z.object({
  isRelevant: z.boolean(),
  formattedAnswer: z.string(),
});

export async function generateGPTAnswer(prompt, responseFormat, responseName) {
  try {
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: prompt,
      response_format: zodResponseFormat(responseFormat, responseName),
    });

    const response = completion.choices[0].message;
    if (response.refusal) {
      // Custom feedback after disturbing user input
      return null;
    }
    loggerOpenAI.info("Successfully generated an AI response! ✅");
    // console.log("📄 Response:", response, "\n");
    console.log("📄 Parsed response:", response.parsed);
    return response.parsed;
  } catch (error) {
    if (error.constructor.name == "LengthFinishReasonError") {
      // Retry with a higher max tokens
    } else {
      // Handle other exceptions
    }
    loggerOpenAI.error(error);
  }
}
