"use client";

import { useChat } from "@ai-sdk/react";
import { Suspense, useState } from "react";

import {
  WeatherCard,
  WeatherSkeleton,
  ErrorCard,
} from "@/components/ui/weather-card";

import type { ChatMessage } from "@/lib/types";

function ChatContent() {
  const { messages, sendMessage, status, stop } = useChat<ChatMessage>();

  const [input, setInput] = useState("");

  console.log("messages:", JSON.stringify(messages, null, 2));

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-4">
      {messages.map((m) => (
        <div key={m.id} className="space-y-3">
          <b>{m.role}</b>

          {m.parts.map((p, i) => {
            switch (p.type) {
              case "text":
                return <p key={i}>{p.text}</p>;

              case "tool-getWeather":
                if (
                  p.state === "input-streaming" ||
                  p.state === "input-available"
                ) {
                  return <WeatherSkeleton key={i} />;
                }

                if (p.state === "output-available") {
                  return <WeatherCard key={i} data={p.output} />;
                }

                if (p.state === "output-error") {
                  return <ErrorCard key={i} msg={p.errorText} />;
                }

                return null;

              default:
                return null;
            }
          })}
        </div>
      ))}

      <form
        onSubmit={(e) => {
          e.preventDefault();

          if (!input.trim()) return;

          sendMessage({ text: input });
          setInput("");
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="border p-2 w-full"
        />

        <button type="submit">Send</button>
      </form>

      {status === "streaming" && <button onClick={stop}>Stop</button>}
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
