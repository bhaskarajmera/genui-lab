import {
  streamText,
  convertToModelMessages,
  type UIMessage,
  stepCountIs,
} from "ai";
import { google } from "@ai-sdk/google";
import { getWeather, showStat, showTable } from "@/lib/tools";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();
    console.log(process.env);
    const result = streamText({
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      model: google("gemini-3.5-flash-lite"), // use the current Flash id
      system: "You are a concise assistant.",
      messages: await convertToModelMessages(messages),
      tools: { getWeather, showTable, showStat },
      stopWhen: stepCountIs(5),
    });

    return result.toUIMessageStreamResponse();
  } catch (e) {
    console.error("Error: ", e);
  }
}
