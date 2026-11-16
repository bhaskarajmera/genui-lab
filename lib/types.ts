import type { UIMessage, InferUITools } from "ai";
import type { getWeather } from "@/lib/tools";

export type ChatMessage = UIMessage<
  never,
  never,
  InferUITools<{
    getWeather: typeof getWeather;
  }>
>;
