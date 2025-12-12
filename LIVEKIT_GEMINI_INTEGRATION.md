# LiveKit + Gemini Integration Guide

This guide explains how to integrate LiveKit with Google's Gemini AI for voice conversations.

## Overview

LiveKit provides real-time audio/video infrastructure, while Gemini provides the AI capabilities. Together, they enable voice-based AI assistants.

## Architecture

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Client    │────────▶│   LiveKit    │────────▶│   Gemini    │
│  (Browser)  │◀────────│    Server    │◀────────│    Agent    │
└─────────────┘         └──────────────┘         └─────────────┘
```

1. **Client**: Your React app connects to LiveKit room
2. **LiveKit Server**: Manages WebRTC connections and media routing
3. **Gemini Agent**: Processes audio, generates responses using Gemini API

## Client-Side Setup (React)

### 1. Install Dependencies

```bash
npm install livekit-client
```

### 2. Connect to LiveKit Room

```typescript
import { Room, RoomEvent } from 'livekit-client';

const room = new Room({
  adaptiveStream: true,
  dynacast: true,
  reconnectPolicy: {
    maxRetries: 5,
    timeout: 10000,
  },
});

// Set up event listeners BEFORE connecting
room.on(RoomEvent.Connected, async () => {
  console.log('Connected to room:', room.name);
  
  // Enable microphone
  await room.localParticipant.setMicrophoneEnabled(true);
});

// Connect to room
await room.connect(url, token);
```

### 3. Handle Audio Tracks

```typescript
room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
  if (track.kind === Track.Kind.Audio) {
    const audioTrack = track as RemoteAudioTrack;
    const audioElement = audioTrack.attach();
    document.body.appendChild(audioElement);
    audioElement.play();
  }
});
```

## Server-Side Agent Setup

### 1. Install LiveKit Agents + Google Plugin

```bash
npm install @livekit/agents @livekit/agents-plugin-google
```

### 2. Create Gemini Agent

```typescript
import * as google from '@livekit/agents-plugin-google';
import { Agent, AgentSession } from '@livekit/agents';

class GeminiVoiceAgent extends Agent {
  async handle() {
    const session = new AgentSession({
      llm: new google.realtime.RealtimeModel({
        model: "gemini-2.0-flash-exp",
        voice: "Puck",
        temperature: 0.8,
        instructions: "You are a helpful voice assistant",
      }),
    });

    await session.start({
      agent: this,
      room: this.room,
    });
  }
}
```

### 3. Run the Agent

```typescript
import { AgentServer } from '@livekit/agents';

const server = new AgentServer();

server.rtcSession(async (ctx) => {
  const agent = new GeminiVoiceAgent();
  await agent.start(ctx);
});

await server.start();
```

## Token Generation

Generate tokens on your backend:

```typescript
import { AccessToken } from 'livekit-server-sdk';

const token = new AccessToken(apiKey, apiSecret, {
  identity: userId,
  name: userName,
});

token.addGrant({
  room: roomName,
  roomJoin: true,
  canPublish: true,
  canSubscribe: true,
});

const jwt = await token.toJwt();
```

## Common Issues & Solutions

### Issue: Room Disconnects Immediately

**Cause**: useEffect cleanup calling disconnect() when state changes

**Solution**: Only disconnect on component unmount, not on state changes:

```typescript
// ❌ WRONG - disconnects when isConnected changes
useEffect(() => {
  return () => disconnect();
}, [isConnected]);

// ✅ CORRECT - only disconnects on unmount
useEffect(() => {
  return () => {
    if (roomRef.current) disconnect();
  };
}, []); // Empty deps
```

### Issue: Microphone Not Publishing

**Cause**: Enabling microphone before connection is fully established

**Solution**: Enable microphone in Connected event handler:

```typescript
room.on(RoomEvent.Connected, async () => {
  // Wait a bit for connection to stabilize
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Then enable microphone
  await room.localParticipant.setMicrophoneEnabled(true);
});
```

### Issue: No Audio Playback

**Cause**: Audio tracks not attached to DOM elements

**Solution**: Attach tracks to audio elements:

```typescript
room.on(RoomEvent.TrackSubscribed, (track) => {
  if (track.kind === Track.Kind.Audio) {
    const audioElement = track.attach();
    audioElement.autoplay = true;
    document.body.appendChild(audioElement);
  }
});
```

## Best Practices

1. **Set up event listeners BEFORE connecting** - Ensures you don't miss events
2. **Use LiveKit's built-in methods** - `setMicrophoneEnabled()` handles track creation/publishing
3. **Handle reconnections** - Configure reconnect policy in Room options
4. **Clean up resources** - Detach tracks and remove DOM elements on disconnect
5. **Monitor connection state** - Log room state periodically for debugging

## Environment Variables

```bash
# LiveKit
LIVEKIT_URL=wss://your-livekit-server.com
LIVEKIT_API_KEY=your-api-key
LIVEKIT_API_SECRET=your-api-secret

# Google Gemini
GOOGLE_API_KEY=your-google-api-key
```

## Resources

- [LiveKit Client SDK Docs](https://docs.livekit.io/client-sdk-js/)
- [LiveKit Agents Docs](https://docs.livekit.io/agents/)
- [Gemini Live API](https://ai.google.dev/gemini-api/docs/live)
- [LiveKit Agents Google Plugin](https://docs.livekit.io/agents/models/realtime/plugins/gemini)

