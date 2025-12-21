# Gemini Live API Integration

This project now uses **Google's Gemini Live API** directly via WebSockets, providing real-time voice conversations without requiring LiveKit Agents.

## What Changed

1. **New Service**: `services/geminiLiveService.ts`

   - Direct WebSocket connection to Gemini Live API
   - Handles audio streaming (16kHz input, 24kHz output)
   - Manages audio playback queue
   - Processes transcripts and audio chunks

2. **New Component**: `components/voice/GeminiLiveVoice.tsx`

   - React component for voice interaction
   - Microphone capture using AudioContext
   - Real-time audio streaming to Gemini
   - Visual feedback and transcript display

3. **Updated Page**: `pages/LiveKitVoicePage.tsx`
   - Simplified interface (no room/participant names needed)
   - Uses GeminiLiveVoice component

## Environment Variables

Make sure you have the following in your `.env` file:

```bash
# Gemini API Key (required)
VITE_GEMINI_API_KEY=your_api_key_here
# OR
VITE_GOOGLE_API_KEY=your_api_key_here
```

**Note**: The service checks for both `VITE_GEMINI_API_KEY` and `VITE_GOOGLE_API_KEY` environment variables.

## How It Works

1. **Connection**: Click the microphone button to connect to Gemini Live API
2. **Audio Input**: Your microphone audio is captured at 16kHz, converted to PCM, and sent to Gemini
3. **Audio Output**: Gemini's responses (24kHz PCM) are played back through your speakers
4. **Transcripts**: Text transcripts of the conversation are displayed in real-time

## Audio Format

- **Input**: 16-bit PCM, 16kHz, mono
- **Output**: 16-bit PCM, 24kHz, mono

## Features

- ✅ Real-time bidirectional audio streaming
- ✅ Voice Activity Detection (handled by Gemini)
- ✅ Text transcripts
- ✅ Mute/unmute functionality
- ✅ Error handling and reconnection
- ✅ Visual feedback (connection status, mute state)

## Usage

1. Navigate to the Live Voice Assistant page
2. Click the microphone button to connect
3. Start speaking - Gemini will respond with voice
4. Use the mute button to temporarily disable your microphone
5. Click "Disconnect" when done

## Troubleshooting

### No audio playback

- Check browser console for errors
- Ensure your speakers/headphones are working
- Try refreshing the page

### Microphone not working

- Check browser permissions for microphone access
- Ensure microphone is not muted in system settings
- Try a different browser

### Connection errors

- Verify `VITE_GEMINI_API_KEY` is set correctly
- Check your internet connection
- Ensure API key has access to Gemini Live API

## Dependencies

- `@google/genai`: Google Gemini SDK
- `mime`: MIME type handling (for audio)

## Next Steps

- Add support for video streaming
- Implement session management for long conversations
- Add support for ephemeral tokens (for production security)
- Add tool/function calling capabilities



