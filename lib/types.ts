import type { UIMessage, InferUITools } from "ai";
import type { getWeather, showTable, showStat, askUser, getLocalTheme } from "@/lib/tools";

export type ChatMessage = UIMessage<
  never,
  never,
  InferUITools<{
    getWeather: typeof getWeather;
    showTable: typeof showTable;
    showStat: typeof showStat;
    askUser: typeof askUser;
    getLocalTheme: typeof getLocalTheme;
  }>
>;
