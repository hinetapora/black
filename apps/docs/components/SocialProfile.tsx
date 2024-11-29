// File: components/SocialProfile.tsx

"use client";

import React, { useEffect, useState } from "react";
import { Tooltip, Link } from "@nextui-org/react";

// Define the props for SocialProfile
interface SocialProfileProps {
  platform: "instagram" | "tiktok" | "twitter";
  handle: string;
}

interface ProfileData {
  profilePicUrl: string;
  followers: number;
  engagementLevel: string;
}

const SocialProfile: React.FC<SocialProfileProps> = ({ platform, handle }) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        let response;
        switch (platform) {
          case "twitter":
            response = await fetch(`/api/twitterProfile?handle=${encodeURIComponent(handle)}`);
            break;
          case "instagram":
            response = await fetch(`/api/instagramProfile?handle=${encodeURIComponent(handle)}`);
            break;
          case "tiktok":
            response = await fetch(`/api/tiktokProfile?handle=${encodeURIComponent(handle)}`);
            break;
          default:
            throw new Error("Unsupported platform");
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch profile data");
        }

        const data: ProfileData = await response.json();
        setProfile(data);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [platform, handle]);

  // Determine API allocation link based on platform
  const getApiAllocationLink = () => {
    switch (platform) {
      case "instagram":
        return "https://www.instagram.com/developer/";
      case "tiktok":
        return "https://developers.tiktok.com/";
      case "twitter":
        return "https://developer.twitter.com/en/docs/twitter-api";
      default:
        return "#";
    }
  };

  return (
    <div className="mt-2 p-2 bg-gray-600 rounded">
      {loading ? (
        <p className="text-gray-300 text-sm">Loading {platform} profile...</p>
      ) : error ? (
        <p className="text-red-500 text-sm">Error: {error}</p>
      ) : profile ? (
        <div className="flex items-center space-x-4">
          <img
            src={profile.profilePicUrl}
            alt={`${platform} profile`}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <p className="text-white font-semibold">@{handle}</p>
            <p className="text-gray-300 text-sm">Followers: {profile.followers}</p>
            <p className="text-gray-300 text-sm">Engagement: {profile.engagementLevel}</p>
          </div>
          <Tooltip content="Manage API Keys">
            <Link href={getApiAllocationLink()} target="_blank" className="ml-auto text-blue-400 underline text-sm">
              API Keys
            </Link>
          </Tooltip>
        </div>
      ) : null}
    </div>
  );
};

export default SocialProfile;
