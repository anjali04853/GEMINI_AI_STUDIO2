/**
 * LiveKit Service
 * Handles token generation and LiveKit room connections
 */

const LIVEKIT_API_URL =
  import.meta.env.VITE_LIVEKIT_API_URL || "http://localhost:3000/api/livekit";
const LIVEKIT_URL =
  import.meta.env.VITE_LIVEKIT_URL || "wss://tinycase-7gtrfdpg.livekit.cloud";

// Sandbox configuration (for development/testing)
const USE_SANDBOX = import.meta.env.VITE_USE_LIVEKIT_SANDBOX === "true";
const SANDBOX_ID =
  import.meta.env.VITE_LIVEKIT_SANDBOX_ID || "tnycase-hackathon-mwlvrf";
const SANDBOX_API_URL =
  "https://cloud-api.livekit.io/api/sandbox/connection-details";

export interface LiveKitTokenResponse {
  token: string;
  url: string;
  roomName?: string;
  participantName?: string;
}

/**
 * Generate a LiveKit access token for joining a room
 * @param roomName - The name of the room to join
 * @param participantName - The name of the participant
 * @returns Access token and LiveKit URL
 */
export async function generateLiveKitToken(
  roomName: string,
  participantName: string
): Promise<LiveKitTokenResponse> {
  try {
    // Use sandbox endpoint if enabled
    if (USE_SANDBOX) {
      return await generateSandboxToken(roomName, participantName);
    }

    // Use custom token server
    const response = await fetch(`${LIVEKIT_API_URL}/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies for authentication
      body: JSON.stringify({
        roomName,
        participantName,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let error;
      try {
        error = JSON.parse(errorText);
      } catch {
        error = { error: errorText || "Failed to generate token" };
      }
      throw new Error(error.error || "Failed to generate LiveKit token");
    }

    const data: LiveKitTokenResponse = await response.json();

    // Validate response structure
    if (!data.token || typeof data.token !== "string") {
      console.error("Invalid token response:", data);
      throw new Error("Invalid token format received from server");
    }

    console.log("Token received successfully, length:", data.token.length);
    return data;
  } catch (error) {
    console.error("Error generating LiveKit token:", error);
    throw error;
  }
}

/**
 * Generate a token using LiveKit Sandbox API (for development/testing)
 * @param roomName - The name of the room to join
 * @param participantName - The name of the participant
 * @returns Access token and LiveKit URL from sandbox
 */
async function generateSandboxToken(
  roomName: string,
  participantName: string
): Promise<LiveKitTokenResponse> {
  try {
    const response = await fetch(SANDBOX_API_URL, {
      method: "POST",
      headers: {
        "X-Sandbox-ID": SANDBOX_ID,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        room_name: roomName,
        participant_name: participantName,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Sandbox API error: ${errorText}`);
    }

    const data = await response.json();

    // Map sandbox response to our format
    return {
      token: data.participantToken,
      url: data.serverUrl,
      roomName: data.roomName,
      participantName: data.participantName,
    };
  } catch (error) {
    console.error("Error generating sandbox token:", error);
    throw error;
  }
}

/**
 * Get LiveKit WebSocket URL
 */
export function getLiveKitUrl(): string {
  return LIVEKIT_URL;
}
