# Gemini Agent Setup Guide

## Why You're Not Hearing Voice

Your LiveKit connection is working perfectly! However, you need a **Gemini agent** running on the server side to:

1. Join the same LiveKit room
2. Listen to your microphone audio
3. Process it with Gemini AI
4. Send audio responses back

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

This will install:

- `@livekit/agents` - LiveKit Agents framework
- `@livekit/agents-plugin-google` - Google Gemini plugin
- `tsx` - TypeScript execution (for running the agent)

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
# Google Gemini API Key (get from https://ai.google.dev/)
GOOGLE_API_KEY=your-google-api-key-here

# LiveKit Credentials (get from https://cloud.livekit.io/)
LIVEKIT_URL=wss://tinycase-7gtrfdpg.livekit.cloud
LIVEKIT_API_KEY=your-livekit-api-key
LIVEKIT_API_SECRET=your-livekit-api-secret
```

### 3. Run the Agent

In a **separate terminal** (keep your Vite dev server running), run:

```bash
# Development mode (auto-restarts on changes)
npm run agent:dev

# Or production mode
npm run agent
```

You should see:

```
🤖 Agent entrypoint called: { room: 'room-...', participant: '...', jobId: '...' }
🚀 Starting agent session...
✅ Agent session started successfully
```

### 4. Test the Connection

1. Open your app in the browser (http://localhost:5173)
2. Navigate to the LiveKit Voice page
3. Click the microphone button to connect
4. You should see the agent join as a participant
5. Speak into your microphone - you'll hear Gemini's voice response!

## How It Works

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Browser   │────────▶│   LiveKit    │────────▶│   Agent     │
│  (Client)   │◀────────│    Server    │◀────────│  (Gemini)   │
└─────────────┘         └──────────────┘         └─────────────┘
     Your mic              WebRTC Room              Processes audio
     Your speakers         Routes audio             Generates response
```

1. **Client** connects to LiveKit room and publishes microphone audio
2. **LiveKit Server** routes audio between client and agent
3. **Agent** receives audio, processes with Gemini, sends response back
4. **Client** receives agent's audio and plays it through speakers

## Troubleshooting

### Agent Not Joining Room

- Check that agent is running: `npm run agent:dev`
- Verify environment variables are set correctly
- Check agent logs for errors
- Ensure LiveKit credentials are correct

### No Audio Playback

- Check browser console for audio errors
- Verify microphone permissions are granted
- Check that audio tracks are being subscribed (look for "🎵 Track subscribed" logs)
- Try unmuting the microphone if it's muted

### Agent Errors

- **"GOOGLE_API_KEY not set"**: Add your Gemini API key to `.env`
- **"LiveKit credentials required"**: Add LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET
- **Connection errors**: Verify LiveKit URL is correct (should start with `wss://`)

## Customizing the Agent

Edit `agents/gemini-agent.ts` to customize:

- **Voice**: Change `voice: 'Puck'` to other options like 'Zephyr', 'Charon', etc.
- **Model**: Change `model: 'gemini-2.0-flash-exp'` to other models
- **Instructions**: Modify the `instructions` field to change agent behavior
- **Temperature**: Adjust `temperature: 0.8` (0-1, higher = more creative)

## Next Steps

Once the agent is running and you can hear responses:

1. Customize the agent's personality and instructions
2. Add error handling and reconnection logic
3. Implement features like transcript display
4. Add visual indicators for when the agent is speaking



