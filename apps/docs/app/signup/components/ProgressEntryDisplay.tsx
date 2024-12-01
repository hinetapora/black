// File: app/signup/components/ProgressEntryDisplay.tsx

import React, { useState, useEffect } from "react";
import { TickIcon } from "./Icons";
import SocialProfile from "@/components/SocialProfile";

interface ProgressInputEntry {
  type: "input";
  label: string;
  value: string;
}

interface ProgressUploadEntry {
  type: "upload";
  label: string;
  value: string | File;
}

type ProgressEntry = ProgressInputEntry | ProgressUploadEntry;

interface ProgressEntryDisplayProps {
  entry: ProgressEntry;
}

const ProgressEntryDisplay: React.FC<ProgressEntryDisplayProps> = ({ entry }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (
      entry.type === "upload" &&
      entry.value instanceof File &&
      entry.value.type.startsWith("image/")
    ) {
      const url = URL.createObjectURL(entry.value);
      setPreviewUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [entry]);

  return (
    <div className="arcade-text-glow mb-4 p-4 bg-gray-700 bg-opacity-80 rounded-lg shadow-md flex items-center justify-between dark:bg-gray-800">
      <div>
        {entry.type === "input" ? (
          <>
            <p className="text-gray-200 dark:text-gray-100">
              <strong>{entry.label}:</strong> {entry.value}
            </p>
            {/* Render SocialProfile for social handles */}
            {["Instagram", "TikTok", "Twitter"].includes(entry.label) &&
              entry.value !== "No input provided" && (
                <SocialProfile
                  platform={
                    entry.label.toLowerCase() as "instagram" | "tiktok" | "twitter"
                  }
                  handle={entry.value}
                />
              )}
          </>
        ) : entry.type === "upload" ? (
          typeof entry.value === "string" ? (
            <p className="text-gray-200 dark:text-gray-100">
              <strong>{entry.label}:</strong> {entry.value}
            </p>
          ) : (
            <div>
              <p className="text-gray-200 dark:text-gray-100">
                <strong>{entry.label}:</strong> {entry.value.name}
              </p>
              <p className="text-gray-200 dark:text-gray-100">
                Size: {Math.round(entry.value.size / 1024)} KB
              </p>
              <p className="text-gray-200 dark:text-gray-100">
                Type: {entry.value.type}
              </p>
              {/* Display Image Preview */}
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt={entry.value.name}
                  className="mt-2 max-w-full h-auto rounded"
                />
              )}
            </div>
          )
        ) : null}
      </div>
      {/* Tick Icon */}
      <TickIcon />
    </div>
  );
};

export default ProgressEntryDisplay;
