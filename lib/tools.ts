import { tool } from "ai";
import { z } from "zod";

// Weather Schema
export const getWeather = tool({
  description: "Get current weather and a 7-day forecast for a city",
  inputSchema: z.object({
    city: z
      .string()
      .describe(
        "The full name of the city for which the user wants weather information.",
      ),
    lat: z.number().describe("The geographic latitude of the requested city."),
    lon: z.number().describe("The geographic longitude of the requested city."),
  }),
  execute: async ({ city, lat, lon }) => {
    const u = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
    const r = await (await fetch(u)).json();

    return {
      city,
      current: r.current,
      daily: r.daily,
    };
  },
});

// Table Schema
export const showTable = tool({
  description: "Display a data table with defined columns and rows.",
  inputSchema: z.object({
    columns: z.array(z.string()).describe("Array of column header titles"),
    rows: z
      .array(z.array(z.string()))
      .describe("2D array representing rows of string values"),
  }),
  execute: async ({ columns, rows }) => ({ columns, rows }),
});

// Stat Schema
export const showStat = tool({
  description:
    "Display a key performance metric stat card with a label, value, and optional delta.",
  inputSchema: z.object({
    label: z.string().describe("The title/label of the metric"),
    value: z.string().describe("The main numeric or text value"),
    delta: z
      .string()
      .optional()
      .describe('Trend indicator or percentage change, e.g. "+12%" or "-3%"'),
  }),
  execute: async ({ label, value, delta }) => ({ label, value, delta }),
});

// Dashboard Widget Schema
const StatWidget = z.object({
  type: z.literal("stat"),
  label: z.string().describe("Metric title"),
  value: z.string().describe("Current metric value"),
  delta: z.string().optional().describe("Percentage change or trend"),
});

const TextWidget = z.object({
  type: z.enum(["text", "markdown"]).describe("Content type"),
  markdown: z.string().describe("Markdown formatted text content"),
});

const TableWidget = z.object({
  type: z.literal("table"),
  columns: z.array(z.string()).describe("Table column headers"),
  rows: z.array(z.array(z.string())).describe("2D array of row string values"),
});

// Automatically flattens if the model nests properties inside a 'data' object
const RawWidget = z.union([StatWidget, TextWidget, TableWidget]);

export const Widget = z.preprocess((val: any) => {
  if (
    val &&
    typeof val === "object" &&
    val.data &&
    typeof val.data === "object"
  ) {
    return {
      type: val.type,
      ...val.data,
    };
  }
  return val;
}, RawWidget);

export const renderDashboard = tool({
  description: "Render a structured dashboard layout with multiple widgets.",
  inputSchema: z.object({
    title: z.string().describe("Main dashboard title"),
    widgets: z.array(Widget).max(8).describe("Array of dashboard widgets"),
  }),
  execute: async (spec) => spec,
});

// Send Email Schema
export const sendEmail = tool({
  description: "Send an email to a recipient with a subject and body.",
  inputSchema: z.object({
    to: z.string().email().describe("Recipient email address"),
    subject: z.string().describe("Email subject line"),
    body: z.string().describe("Email body content"),
  }),
  needsApproval: true,
  execute: async ({ to, subject, body }) => {
    // Simulated email delivery logic
    console.log(`Sending email to ${to}: ${subject}`);
    return { sent: true, recipient: to, timestamp: new Date().toISOString() };
  },
});

// Ask User Schema
export const askUser = tool({
  description: "Ask the user to pick an option from a list of choices.",
  inputSchema: z.object({
    question: z.string().describe("The question to ask the user"),
    options: z.array(z.string()).describe("List of clickable choices"),
  }),
  outputSchema: z.string(),
  // No execute function: pauses execution so the client can supply the output
});

// Get Local Theme Schema
export const getLocalTheme = tool({
  description:
    "Get the current theme preference stored in the browser's localStorage.",
  inputSchema: z.object({}), // No input parameters required from the model
});
