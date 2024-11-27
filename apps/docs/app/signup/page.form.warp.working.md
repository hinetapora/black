"use client";

import React, { useState, useEffect, useRef } from "react";
import { GrPowerReset } from "react-icons/gr";
import { Card, Tooltip } from "@nextui-org/react";
import { FaInfoCircle } from "react-icons/fa";
import dynamic from "next/dynamic";

// Dynamically import FullscreenWarp to prevent SSR issues
const FullscreenWarp = dynamic(() => import("./fullscreenwarp"), { ssr: false });

// Attach Icon Component
const AttachIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="text-white"
    width="12"
    height="12"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9 7C9 4.23858 11.2386 2 14 2C16.7614 2 19 4.23858 19 7V15C19 18.866 15.866 22 12 22C8.13401 22 5 18.866 5 15V9C5 8.44772 5.44772 8 6 8C6.55228 8 7 8.44772 7 9V15C7 17.7614 9.23858 20 12 20C14.7614 20 17 17.7614 17 15V7C17 5.34315 15.6569 4 14 4C12.3431 4 11 5.34315 11 7V15C11 15.5523 11.4477 16 12 16C12.5523 16 13 15.5523 13 15V9C13 8.44772 13.44772 8 14 8C14.5523 8 15 8.44772 15 9V15C15 16.6569 13.6569 18 12 18C10.3431 18 9 16.6569 9 15V7Z"
    ></path>
  </svg>
);

// Submit Icon Component (Up Arrow)
const SubmitIcon = () => (
  <svg
    width="16" // Increased from 12 to 16
    height="16" // Increased from 12 to 16
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-white" // Ensure the arrow is white
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.1918 8.90615C15.6381 8.45983 16.3618 8.45983 16.8081 8.90615L21.9509 14.049C22.3972 14.4953 22.3972 15.2189 21.9509 15.6652C21.5046 16.1116 20.781 16.1116 20.3347 15.6652L17.1428 12.4734V22.2857C17.1428 22.9169 16.6311 23.4286 15.9999 23.4286C15.3688 23.4286 14.8571 22.9169 14.8571 22.2857V12.4734L11.6652 15.6652C11.2189 16.1116 10.4953 16.1116 10.049 15.6652C9.60265 15.2189 9.60265 14.4953 10.049 14.049L15.1918 8.90615Z"
      fill="currentColor"
    ></path>
  </svg>
);

// Progress Entry Interfaces
interface InputProgressEntry {
  type: "input";
  label: string;
  value: string;
}

interface UploadProgressEntry {
  type: "upload";
  label: string;
  value: string | File;
}

type ProgressEntry = InputProgressEntry | UploadProgressEntry;

// Typing Effect Hook
const useTypingEffect = (
  fullText: string,
  speed: number = 100
): [string, boolean] => {
  const [typedText, setTypedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const indexRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setTypedText("");
    setIsTypingComplete(false);
    indexRef.current = 0;

    intervalRef.current = setInterval(() => {
      if (indexRef.current < fullText.length) {
        setTypedText((prev) => prev + fullText.charAt(indexRef.current));
        indexRef.current += 1;
      } else {
        setIsTypingComplete(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fullText, speed]);

  return [typedText, isTypingComplete];
};

const SignupPage = () => {
  // Warp State
  const [showWarp, setShowWarp] = useState(false);

  // States for Form
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [step, setStep] = useState(0); // Initialize to 0

  // Steps Definition
  const steps = [
    { type: "input", placeholder: "Enter your brand name", label: "Brand name" },
    { type: "upload", placeholder: "Upload your Web Wide Logo Image (optional)", label: "Web Wide Logo Image" },
    { type: "upload", placeholder: "Upload your App Square Logo Image (optional)", label: "App Square Logo Image" },
    { type: "upload", placeholder: "Upload your Web Hero Image (optional)", label: "Web Hero Image" },
    { type: "input", placeholder: "Enter your first name", label: "First name" },
    { type: "input", placeholder: "Enter your last name", label: "Last name" },
    { type: "input", placeholder: "Enter your country (optional)", label: "Country" },
    { type: "input", placeholder: "Enter your Instagram handle (optional)", label: "Instagram" },
    { type: "input", placeholder: "Enter your TikTok handle (optional)", label: "TikTok" },
    { type: "input", placeholder: "Enter your Twitter handle (optional)", label: "Twitter" },
  ];

  const fullHeadingText = "Let’s get your details";

  // Use Typing Effect Hook
  const [typedText, isTypingComplete] = useTypingEffect(fullHeadingText, 100);

  // Automatically set step to 1 when typing is complete
  useEffect(() => {
    if (isTypingComplete) {
      setStep(1);
    }
  }, [isTypingComplete]);

  // Handle Input Submission (for both text and file uploads)
  const handleInputSubmit = () => {
    if (step === 0) return; // Prevent submission before typing effect

    const currentStep = steps[step - 1];

    if (currentStep.type === "input") {
      if (!currentInput.trim()) return;

      setProgress((prev) => [
        ...prev,
        { type: "input", label: currentStep.label, value: currentInput.trim() },
      ]);
      setCurrentInput("");
    } else if (currentStep.type === "upload") {
      if (selectedFile) {
        setProgress((prev) => [
          ...prev,
          { type: "upload", label: currentStep.label, value: selectedFile },
        ]);
        setSelectedFile(null);
      } else {
        // If upload is optional and no file is selected, proceed to next step
        setProgress((prev) => [
          ...prev,
          { type: "upload", label: currentStep.label, value: "No file uploaded" },
        ]);
      }
    }

    // Proceed to next step
    if (step < steps.length) {
      setStep((prev) => prev + 1);
    }
  };

  // Handle key down event for Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default behavior
      handleInputSubmit();
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Handle reset action
  const handleReset = () => {
    if (steps[step - 1]?.type === "input") {
      setCurrentInput("");
    } else if (steps[step - 1]?.type === "upload") {
      setSelectedFile(null);
    }
  };

  // Calculate progress percentage for the linear progress bar
  const progressPercentage = (progress.length / steps.length) * 100;

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      progress.forEach((entry) => {
        if (entry.type === "upload" && entry.value instanceof File) {
          URL.revokeObjectURL(entry.value.name);
        }
      });
    };
  }, [progress]);

  // Handle Warp Completion
  const handleWarpComplete = () => {
    window.location.href = "/dashboard"; // Redirect to the dashboard after warp
  };

  // If warp is active, render FullscreenWarp
  if (showWarp) {
    return <FullscreenWarp onWarpComplete={handleWarpComplete} />;
  }

  return (
    <section className="flex flex-col items-center bg-black text-green-400 min-h-screen px-4 sm:px-6 lg:px-8 py-8 relative">
      {/* Heading with Typing Effect Positioned Above Input Box */}
      <h1 className="text-3xl text-white mb-6">
        {typedText}
      </h1>

      {/* Main Content */}
      <main className="w-full max-w-md flex flex-col space-y-4 z-10">
        {/* Input Area */}
        {step <= steps.length ? (
          <div className="relative">
            <div className="flex flex-col bg-gray-800 rounded-lg p-4">
              {/* Top Row: Input Field or Upload Prompt */}
              <div className="flex-1">
                {steps[step - 1]?.type === "input" ? (
                  <textarea
                    placeholder={steps[step - 1]?.placeholder}
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={2}
                    className="w-full h-12 bg-gray-700 text-white px-4 py-2 focus:outline-none rounded-lg resize-none"
                  ></textarea>
                ) : steps[step - 1]?.type === "upload" ? (
                  <div>
                    <label
                      htmlFor={`file-input-${step}`}
                      className="cursor-pointer flex items-center justify-between bg-gray-700 px-4 py-2 rounded-lg"
                    >
                      <span className="text-sm text-gray-300">
                        {selectedFile ? selectedFile.name : steps[step - 1]?.placeholder}
                      </span>
                      <AttachIcon />
                    </label>
                    <input
                      type="file"
                      id={`file-input-${step}`}
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                ) : null}
              </div>

              {/* Bottom Row: Icons */}
              <div className="flex justify-between mt-4">
                {/* Left Icons: Attach and Reset */}
                <div className="flex space-x-2">
                  {/* Attach Icon */}
                  {steps[step - 1]?.type === "upload" ? (
                    <label htmlFor={`file-input-${step}`} className="cursor-pointer flex items-center justify-center" aria-label="Attach file">
                      <div className="bg-black rounded-full w-10 h-10 flex items-center justify-center">
                        <AttachIcon />
                      </div>
                      <input
                        type="file"
                        id={`file-input-${step}`}
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  ) : (
                    // Inactive Attach Icon for text prompts
                    <div className="bg-black rounded-full w-10 h-10 flex items-center justify-center opacity-50">
                      <AttachIcon />
                    </div>
                  )}

                  {/* Reset Icon */}
                  <button
                    onClick={handleReset}
                    className="bg-black rounded-full w-10 h-10 flex items-center justify-center cursor-pointer"
                    aria-label="Reset input"
                  >
                    <GrPowerReset className="text-white" size={16} />
                  </button>
                </div>

                {/* Submit Icon: Always Visible */}
                <button
                  onClick={handleInputSubmit}
                  className="bg-black rounded-full w-10 h-10 flex items-center justify-center cursor-pointer"
                  aria-label="Submit input"
                >
                  <SubmitIcon />
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {/* Progress Bar Positioned Below Input Box and Above Progress Panel */}
        <div className="w-full mb-6">
          <div className="h-2 bg-gray-700 rounded-full">
            <div
              className="h-2 bg-green-400 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mt-4 arcade-text w-full">
          {progress.map((entry, index) => (
            <div key={index} className="arcade-text-glow mb-4 p-2 bg-gray-800 rounded text-sm">
              {entry.type === "input" ? (
                <p>
                  <strong>{entry.label}:</strong> {entry.value}
                </p>
              ) : entry.type === "upload" ? (
                typeof entry.value === "string" ? (
                  <p>
                    <strong>{entry.label}:</strong> {entry.value}
                  </p>
                ) : (
                  <div>
                    <p>
                      <strong>{entry.label}:</strong> {entry.value.name}
                    </p>
                    <p>Size: {Math.round(entry.value.size / 1024)} KB</p>
                    <p>Type: {entry.value.type}</p>
                    {/* Display Image Preview */}
                    {entry.value.type.startsWith("image/") && (
                      <img
                        src={URL.createObjectURL(entry.value)}
                        alt={entry.value.name}
                        className="mt-2 max-w-full h-auto rounded"
                      />
                    )}
                  </div>
                )
              ) : null}
            </div>
          ))}
        </div>

        {/* Submit Button (Visible After All Steps Are Completed) */}
        {progress.length === steps.length && (
          <button
            onClick={() => setShowWarp(true)}
            className="mt-6 w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg py-3 rounded-full shadow-lg hover:from-blue-600 hover:to-purple-600 transition-colors duration-300"
          >
            Submit
          </button>
        )}
      </main>

      {/* Optional: Overlay for Fullscreen Warp */}
      {/* The FullscreenWarp component is rendered conditionally above */}
    </section>
  );
};

export default SignupPage;
