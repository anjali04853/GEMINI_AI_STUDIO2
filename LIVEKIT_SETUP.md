# LiveKit Integration Setup Guide

This guide explains how to set up LiveKit with Gemini Live API for real-time voice conversations.

## Prerequisites

1. **Google Gemini API Key**: Get your API key from [Google AI Studio](https://ai.google.dev/)
2. **LiveKit Account**: Sign up at [LiveKit Cloud](https://cloud.livekit.io/) or use your own LiveKit server
3. **Next.js Backend**: The nextjs-template project should be running with the agent worker

## Environment Variables

### For SkillForge (Frontend)

Create a `.env` file in the root of `SkillForge` with:

```bash
# Google Gemini API Key
GEMINI_API_KEY=AIzaSyCumWxziEWe3nvkYzyeVI2eTHAspUPmdxM

# LiveKit Configuration
VITE_LIVEKIT_URL=wss://tinycase-7gtrfdpg.livekit.cloud
VITE_LIVEKIT_API_URL=http://localhost:3000/api/livekit
```

**Note**: Update `VITE_LIVEKIT_API_URL` to match your Next.js backend URL if it's different from `http://localhost:3000`.

### For nextjs-template (Backend)

Create a `.env.local` file in the root of `nextjs-template` with:

```bash
# Google Gemini API Key
GOOGLE_API_KEY=AIzaSyCumWxziEWe3nvkYzyeVI2eTHAspUPmdxM

# LiveKit Configuration
LIVEKIT_URL=wss://tinycase-7gtrfdpg.livekit.cloud
LIVEKIT_API_KEY=APISirK57jsCYhX
LIVEKIT_API_SECRET=etcLWyYuLPGHcELIls47xNl665SNk8V2sDELo62a8WP

# Optional: Public LiveKit URL for client connections
NEXT_PUBLIC_LIVEKIT_URL=wss://tinycase-7gtrfdpg.livekit.cloud
```

## Setup Steps

### 1. Start the Backend Agent

In the `nextjs-template` directory:

```bash
# Install dependencies (if not already done)
npm install

# Start the LiveKit agent worker
npm run agent
```

The agent will connect to LiveKit and wait for room connections.

### 2. Start the Next.js Backend Server

In a separate terminal, start the Next.js server:

```bash
cd nextjs-template
npm run dev
```

This will start the server on `http://localhost:3000` (or your configured port).

### 3. Start the Frontend App

In the `SkillForge` directory:

```bash
# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:3000` (or your configured port).

## Usage

1. **Navigate to Live Voice Page**: Go to `/dashboard/voice-live` in your SkillForge app
2. **Configure Room Settings**: Enter a room name and your participant name
3. **Connect**: Click the microphone button to connect to the LiveKit room
4. **Start Talking**: Once connected, speak into your microphone. The Gemini agent will respond in real-time
5. **View Transcript**: See the conversation transcript in the sidebar

## Features

- **Real-time Voice Interaction**: Speak naturally with the Gemini AI assistant
- **Live Transcript**: See the conversation transcript as it happens
- **Mute/Unmute**: Control your microphone during the conversation
- **Room-based**: Each conversation happens in a separate room
- **Automatic Reconnection**: Handles connection issues gracefully

## Troubleshooting

### Connection Issues

- **Check Agent Status**: Ensure the agent worker is running (`npm run agent` in nextjs-template)
- **Verify Environment Variables**: Make sure all environment variables are set correctly
- **Check CORS**: Ensure the backend allows requests from your frontend URL
- **Network Issues**: Verify that WebSocket connections are not blocked by firewall

### Audio Issues

- **Microphone Permissions**: Ensure your browser has microphone permissions
- **Audio Device**: Check that your microphone is working and selected
- **Browser Compatibility**: Use a modern browser that supports WebRTC (Chrome, Firefox, Safari, Edge)

### Authentication Issues

- **Backend Authentication**: The token endpoint requires authentication. Make sure you're logged in
- **CORS Credentials**: The frontend sends credentials with requests. Ensure CORS is configured correctly

## Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   SkillForge    │────────▶│  nextjs-template │────────▶│  LiveKit Agent  │
│   (Frontend)    │  Token  │    (Backend)     │  Token  │   (Worker)      │
└─────────────────┘         └──────────────────┘         └─────────────────┘
         │                           │                              │
         │                           │                              │
         └───────────────────────────┴──────────────────────────────┘
                                    │
                                    ▼
                            ┌───────────────┐
                            │  LiveKit Room │
                            │  (WebSocket)  │
                            └───────────────┘
```

## API Endpoints

### POST `/api/livekit/token`

Generates a LiveKit access token for joining a room.

**Request:**
```json
{
  "roomName": "my-room",
  "participantName": "John Doe"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "url": "wss://tinycase-7gtrfdpg.livekit.cloud"
}
```

**Authentication:** Required (JWT cookie)

## Security Notes

- Never expose `LIVEKIT_API_SECRET` or `GOOGLE_API_KEY` to the client
- Use environment variables for all sensitive credentials
- Implement rate limiting on token generation endpoints
- Validate room names and participant names to prevent abuse
- Use HTTPS/WSS in production

## Next Steps

- Customize the agent's instructions and behavior in `agents/gemini-agent.ts`
- Add more features like video support, screen sharing, etc.
- Implement room persistence and history
- Add user authentication and authorization for rooms

