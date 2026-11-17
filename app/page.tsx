"use client";

import { useChat } from "@ai-sdk/react";
import { Suspense, useEffect, useState } from "react";
import { Streamdown } from "streamdown";

import type { ChatMessage } from "@/lib/types";

import { WeatherCard } from "@/components/ui/weather-card";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/dataTable";

import {
  Conversation,
  ConversationContent,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";

function ErrorCard({ msg }: { msg: string }) {
  return (
    <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-destructive text-sm my-2">
      Error: {msg}
    </div>
  );
}

const registry: Record<string, React.ComponentType<any>> = {
  "tool-getWeather": WeatherCard,
  "tool-showTable": DataTable,
  "tool-showStat": StatCard,
};

export function PartRenderer({ part }: { part: any }) {
  if (part.type === "text") return <Streamdown>{part.text}</Streamdown>;
  const C = registry[part.type];
  if (!C) return null;
  if (part.state === "output-error") return <ErrorCard msg={part.errorText} />;
  if (part.state === "output-available") return <C {...part.output} />;
  return <C {...(part.input ?? {})} loading />; // partial args while streaming
}
function ChatContent() {
  const { messages, sendMessage, status, stop } = useChat<ChatMessage>();
  const [input, setInput] = useState("");

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Render nothing or a skeleton on the server/first render pass
  if (!isMounted) {
    return <div className="h-10 border rounded-md bg-muted/20 animate-pulse" />;
  }

  return (
    <main className="mx-auto max-w-3xl p-6 flex flex-col h-screen justify-between">
      <Conversation className="flex-1 overflow-y-auto mb-4 pr-2">
        <ConversationContent className="space-y-4">
          {messages.map((m) => (
            <Message key={m.id} from={m.role === "user" ? "user" : "assistant"}>
              <MessageContent>
                {m.parts.map((p, i) => (
                  <PartRenderer key={i} part={p} />
                ))}
              </MessageContent>
            </Message>
          ))}
        </ConversationContent>
      </Conversation>

      <div className="space-y-2 border-t pt-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!input.trim()) return;
            sendMessage({ text: input });
            setInput("");
          }}
          className="flex gap-2"
        >
          <input
            suppressHydrationWarning
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="border rounded-md p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium"
          >
            Send
          </button>
        </form>

        {status === "streaming" && (
          <button
            type="button"
            onClick={stop}
            className="text-sm text-destructive underline"
          >
            Stop generation
          </button>
        )}
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading chat...</div>}>
      <ChatContent />
    </Suspense>
  );
}
