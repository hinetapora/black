// File: app/api/instagramProfile/route.ts

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

  const instagramApiKey = process.env.INSTAGRAM_API_KEY;

  if (!instagramApiKey) {
    return NextResponse.json({ error: 'Instagram API Key is not configured.' }, { status: 500 });
  }

  try {
    // Replace with the actual Instagram API endpoint and parameters
    const response = await fetch(`https://graph.instagram.com/${handle}?fields=id,username,account_type,media_count,followers_count,profile_picture_url&access_token=${instagramApiKey}`);

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData }, { status: response.status });
    }

    const data = await response.json();

    const profileData: ProfileData = {
      profilePicUrl: data.profile_picture_url,
      followers: data.followers_count,
      engagementLevel: calculateEngagementLevel(data.followers_count),
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
