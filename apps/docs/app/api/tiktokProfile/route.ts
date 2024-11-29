// File: app/api/tiktokProfile/route.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface ProfileData {
  profilePicUrl: string;
  followers: number;
  engagementLevel: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const handle = searchParams.get('handle');

  if (!handle) {
    return NextResponse.json({ error: 'Handle is required.' }, { status: 400 });
  }

  const tiktokApiKey = process.env.TIKTOK_API_KEY;

  if (!tiktokApiKey) {
    return NextResponse.json({ error: 'TikTok API Key is not configured.' }, { status: 500 });
  }

  try {
    // Replace with the actual TikTok API endpoint and parameters
    const response = await fetch(`https://open-api.tiktok.com/user/info/?username=${handle}&access_token=${tiktokApiKey}`);

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData }, { status: response.status });
    }

    const data = await response.json();

    const profileData: ProfileData = {
      profilePicUrl: data.data.avatar_url, // Adjust based on actual API response
      followers: data.data.followers_count, // Adjust based on actual API response
      engagementLevel: calculateEngagementLevel(data.data.followers_count),
    };

    return NextResponse.json(profileData, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'An unexpected error occurred.' }, { status: 500 });
  }
}

// Example function to determine engagement level
function calculateEngagementLevel(followers: number): string {
  if (followers > 10000) return 'High';
  if (followers > 1000) return 'Medium';
  return 'Low';
}
