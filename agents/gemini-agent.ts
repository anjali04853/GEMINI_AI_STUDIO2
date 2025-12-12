#!/usr/bin/env node
/**
 * LiveKit Agent with Gemini Live API
 *
 * This agent worker connects to LiveKit rooms and uses Google's Gemini Live API
 * for natural voice conversations.
 *
 * Run this file with: npm run agent
 * Or in development mode: npm run agent:dev
 *
 * Make sure you have set the following environment variables:
 * - GOOGLE_API_KEY or GEMINI_API_KEY: Your Google Gemini API key
 * - LIVEKIT_URL: Your LiveKit server URL (e.g., wss://your-livekit-server.com)
 * - LIVEKIT_API_KEY: Your LiveKit API key
 * - LIVEKIT_API_SECRET: Your LiveKit API secret
 */

// Load environment variables from .env file
import "dotenv/config";

import {
  ServerOptions,
  JobRequest,
  getJobContext,
  voice,
  cli,
} from "@livekit/agents";
import * as google from "@livekit/agents-plugin-google";

// Ensure environment variables are loaded
// Support both GOOGLE_API_KEY and GEMINI_API_KEY for flexibility
const googleApiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
if (!googleApiKey) {
  console.error(
    "Error: GOOGLE_API_KEY or GEMINI_API_KEY environment variable is required"
  );
  console.error("Get your API key from: https://ai.google.dev/");
  console.error("Current env vars:", {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY ? "set" : "not set",
    GEMINI_API_KEY: process.env.GEMINI_API_KEY ? "set" : "not set",
  });
  process.exit(1);
}

// Check LiveKit credentials with better error messages
const livekitUrl = process.env.LIVEKIT_URL || process.env.VITE_LIVEKIT_URL;
const livekitApiKey = process.env.LIVEKIT_API_KEY;
const livekitApiSecret = process.env.LIVEKIT_API_SECRET;

if (!livekitUrl || !livekitApiKey || !livekitApiSecret) {
  console.error("Error: LiveKit credentials are required");
  console.error(
    "Required variables: LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET"
  );
  console.error("Get your credentials from: https://cloud.livekit.io/");
  console.error("\nCurrent environment variables:");
  console.error({
    LIVEKIT_URL: livekitUrl ? "✓ set" : "✗ missing",
    LIVEKIT_API_KEY: livekitApiKey ? "✓ set" : "✗ missing",
    LIVEKIT_API_SECRET: livekitApiSecret ? "✓ set" : "✗ missing",
    VITE_LIVEKIT_URL: process.env.VITE_LIVEKIT_URL
      ? "✓ set (can use as LIVEKIT_URL)"
      : "✗ missing",
  });
  console.error("\n💡 Tip: Add these to your .env file in the project root");
  process.exit(1);
}

// Define the entrypoint function
async function entrypoint(req: JobRequest) {
  await req.accept();

  // Get the job context after accepting
  const ctx = getJobContext();

  console.log("🤖 Agent entrypoint called:", {
    room: ctx.room.name,
    participant: ctx.agent.identity,
    jobId: ctx.job.id,
  });

  // Create an Agent with instructions
  const agent = new voice.Agent({
    instructions:
      "You are a helpful voice assistant. Be concise, friendly, and natural in your responses. Speak clearly and at a moderate pace.",
  });

  // Create Gemini Live API session
  const session = new voice.AgentSession({
    llm: new google.beta.realtime.RealtimeModel({
      model: "gemini-2.5-flash-native-audio-preview-09-2025",
      voice: "Puck",
      temperature: 0.8,
      apiKey: googleApiKey,
    }),
  });

  // Log session events
  session.on(voice.AgentSessionEventTypes.UserInputTranscribed, (ev) => {
    console.log("👤 User said:", ev.transcript);
  });

  session.on(voice.AgentSessionEventTypes.SpeechCreated, (ev) => {
    console.log("🤖 Agent speech created:", ev.source);
  });

  session.on(voice.AgentSessionEventTypes.ConversationItemAdded, (ev) => {
    if (ev.item.role === "assistant") {
      console.log("🤖 Agent responded:", ev.item.content);
    }
  });

  session.on(voice.AgentSessionEventTypes.Error, (ev) => {
    console.error("❌ Session error:", ev.error);
  });

  console.log("🚀 Starting agent session...");
  // Start the session with agent and room
  await session.start({
    agent,
    room: ctx.room,
  });
  console.log("✅ Agent session started successfully");
}

// Run the agent using CLI
cli.runApp(
  new ServerOptions({
    agent: import.meta.url,
    requestFunc: entrypoint,
  })
);
