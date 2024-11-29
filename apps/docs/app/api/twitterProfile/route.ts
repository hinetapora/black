// File: app/api/twitterProfile/route.ts

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

  const bearerToken = process.env.TWITTER_BEARER_TOKEN;

  if (!bearerToken) {
    return NextResponse.json({ error: 'Twitter Bearer Token is not configured.' }, { status: 500 });
  }

  try {
    const response = await fetch(`https://api.twitter.com/2/users/by/username/${handle}?user.fields=profile_image_url,public_metrics`, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData }, { status: response.status });
    }

    const data = await response.json();

    const profileData: ProfileData = {
      profilePicUrl: data.data.profile_image_url,
      followers: data.data.public_metrics.followers_count,
      engagementLevel: calculateEngagementLevel(data.data.public_metrics.followers_count),
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
