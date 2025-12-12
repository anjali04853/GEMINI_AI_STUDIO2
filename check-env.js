#!/usr/bin/env node
/**
 * Check environment variables for LiveKit Agent
 */

import 'dotenv/config';

console.log('🔍 Checking environment variables...\n');

const required = {
  'GEMINI_API_KEY or GOOGLE_API_KEY': process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
  'LIVEKIT_URL': process.env.LIVEKIT_URL || process.env.VITE_LIVEKIT_URL,
  'LIVEKIT_API_KEY': process.env.LIVEKIT_API_KEY,
  'LIVEKIT_API_SECRET': process.env.LIVEKIT_API_SECRET,
};

let allGood = true;

for (const [name, value] of Object.entries(required)) {
  if (value) {
    console.log(`✅ ${name}: ${value.substring(0, 20)}...`);
  } else {
    console.log(`❌ ${name}: MISSING`);
    allGood = false;
  }
}

if (!allGood) {
  console.log('\n📝 Add these to your .env file:');
  console.log('\n# LiveKit Credentials (get from https://cloud.livekit.io/)');
  console.log('LIVEKIT_URL=wss://tinycase-7gtrfdpg.livekit.cloud');
  console.log('LIVEKIT_API_KEY=your-api-key-here');
  console.log('LIVEKIT_API_SECRET=your-api-secret-here');
  console.log('\n💡 How to get LiveKit credentials:');
  console.log('1. Go to https://cloud.livekit.io/');
  console.log('2. Sign in or create an account');
  console.log('3. Create a new project or select existing one');
  console.log('4. Go to Project Settings > Keys');
  console.log('5. Copy the API Key and API Secret');
  process.exit(1);
} else {
  console.log('\n✅ All environment variables are set!');
  console.log('You can now run: npm run agent:dev');
}

