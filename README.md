# GenUI Chat & Telemetry Dashboard Assistant

A Next.js (App Router) conversational interface and Generative UI (GenUI) dashboard application built with the **Vercel AI SDK v6**, **Google Gemini**, **shadcn/ui**, and **Streamdown**. 

This project demonstrates deterministic UI rendering from LLM tool calls, multi-widget dashboard streaming, human-in-the-loop approval flows, and interactive client-side tools.

---

## Running Live

Open [Demo App](https://genui-lab-tau.vercel.app/)

---
## ✨ Key Features

- **Generative UI Component Registry (`PartRenderer`):** Maps typed AI message parts directly to React components (`WeatherCard`, `StatCard`, `DataTable`, `DashboardCard`, `ApprovalCard`) with real-time skeleton states during argument streaming.
- **Resilient Structured Dashboards (`renderDashboard`):** Uses Zod discriminated unions wrapped in `z.preprocess` to automatically normalize nested or flat JSON payloads from the model into multi-widget telemetry layouts.
- **Human-in-the-Loop Tool Approvals (`sendEmail`):** Pauses execution on sensitive actions (`needsApproval: true`), rendering an interactive approval card before executing server-side delivery and auto-resuming the stream.
- **Interactive & Browser-Native Client Tools (`askUser`, `getLocalTheme`):** Supports tools without server `execute` functions—pausing for inline user choice selection (`addToolOutput`) or reading client-side browser state (`localStorage`) via `onToolCall`.
- **Streaming Markdown (`Streamdown`):** Smoothly renders rich prose, technical post-mortems, and code blocks alongside interactive widgets.

---

## 🏗️ Architecture Sketch

```text
+-------------------------------------------------------------------+
|                        Next.js Client (UI)                        |
|                                                                   |
|  useChat() <-----> PartRenderer (Component Registry)              |
|     |                 |-- text ------------> <Streamdown />       |
|     |                 |-- tool-getWeather -> <WeatherCard />      |
|     |                 |-- tool-showStat ---> <StatCard />         |
|     |                 |-- tool-showTable --> <DataTable />        |
|     |                 |-- tool-renderDash -> <DashboardCard />    |
|     |                 |-- tool-sendEmail --> <ApprovalCard />     |
|     |                 |-- tool-askUser ----> Choice Picker UI     |
|     |                                                             |
|     +--- Auto-Resume (Approval Responses & Client Tool Outputs)   |
+---------------------------------+---------------------------------+
                                  | HTTP / Data Stream
                                  v
+-------------------------------------------------------------------+
|                    Next.js API Route (/api/chat)                  |
|                                                                   |
|  streamText({ model: google('gemini-...'), tools })               |
|     |-- getWeather (Server execute)                               |
|     |-- showStat / showTable / renderDashboard (Schema-validated) |
|     |-- sendEmail (needsApproval: true -> Server execute)         |
|     |-- askUser / getLocalTheme (No execute -> Client-handled)    |
+-------------------------------------------------------------------+
```

---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router), React, TypeScript
- **AI & Streaming:** Vercel AI SDK (`ai@6`, `@ai-sdk/react`, `@ai-sdk/google`), `streamdown`
- **Validation:** Zod (`z.discriminatedUnion`, `z.preprocess`)
- **Styling & UI:** Tailwind CSS, shadcn/ui (`Card`, `Table`, `Skeleton`)
- **Package Manager:** `pnpm`

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+
- `pnpm` installed (`npm install -g pnpm`)
- A Google Gemini API key

### 2. Installation
```bash
git clone <your-repo-url>
cd <your-project-folder>
pnpm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and add your API keys:

```env
# Required: Google Gemini API Key
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here

# Optional: Email Provider API Key (if using Resend/SMTP in sendEmail)
RESEND_API_KEY=your_resend_api_key_here
```

### 4. Run the Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to start chatting.

---

## 🧪 Example Prompts to Test

1. **Multi-Widget Telemetry Dashboard:**
   > *"Generate a 6-widget operational telemetry dashboard for a microservices platform with Active API Gateway RPS (48.2k, +14.2%), Global P99 Latency (42ms, -8.5%), a markdown post-mortem on memory leak mitigation, a regional cluster metrics table, Cache Hit Ratio (99.1%, +0.4%), and rate-limiting remediation steps."*
2. **Human-in-the-Loop Approval (`sendEmail`):**
   > *"Send an email to sarah@example.com with the subject 'Q4 Telemetry Report' and let her know the API gateway latency dropped by 8.5%."*
3. **Interactive Choice Picker (`askUser`):**
   > *"Help me configure a new cluster alert, but ask me which severity level I prefer first."*
4. **Browser State Inspection (`getLocalTheme`):**
   > *"Check what theme my browser currently has saved in local storage."*

---

## 📖 Core Architectural Concepts

### What is a UI Message Part?
A UI message part is an atomic, typed segment of an assistant's response. Instead of treating a message as a single string, the AI SDK splits responses into distinct parts (`text`, `tool-*`). This allows the frontend to stream rich, interactive React components inline with markdown text.

### The Four Tool Execution States
1. **`input-streaming`:** The LLM is actively generating tool arguments token-by-token. Used to render skeleton loaders with partial props.
2. **`approval-requested`:** Execution is paused before running `execute` (`needsApproval: true`), awaiting user confirmation via `addToolApprovalResponse`.
3. **`output-available`:** Tool execution completed (on server or client via `addToolOutput`), and `part.output` is ready to render.
4. **`output-error`:** Tool validation or execution failed, rendering a fallback `<ErrorCard />`.

### Why Schema-First?
Defining strict Zod schemas (`inputSchema`) before building UI components establishes a deterministic contract between the LLM and the frontend. Combining Zod validation with `z.preprocess` guarantees type safety and prevents runtime crashes even when models vary their JSON nesting structure.