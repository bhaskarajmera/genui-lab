import { tool } from "ai";
import { z } from "zod";

export const getWeather = tool({
  description: "Get current weather and a 7-day forecast for a city",
  inputSchema: z.object({
    city: z.string().describe("The full name of the city for which the user wants weather information."),
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

export const showTable = tool({
  description: "Display a data table with defined columns and rows.",
  inputSchema: z.object({
    columns: z.array(z.string()).describe("Array of column header titles"),
    rows: z.array(z.array(z.string())).describe("2D array representing rows of string values"),
  }),
  execute: async ({ columns, rows }) => ({ columns, rows }),
});

export const showStat = tool({
  description: "Display a key performance metric stat card with a label, value, and optional delta.",
  inputSchema: z.object({
    label: z.string().describe("The title/label of the metric"),
    value: z.string().describe("The main numeric or text value"),
    delta: z.string().optional().describe('Trend indicator or percentage change, e.g. "+12%" or "-3%"'),
  }),
  execute: async ({ label, value, delta }) => ({ label, value, delta }),
});