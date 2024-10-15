import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { loggerOpenAI } from "../Utils/logger.js";

const openai = new OpenAI();

export const sqlResponse = z.object({
  isSelect: z.boolean(),
  sqlStatement: z.string(),
});

export const finalResponse = z.object({
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
