// File: app/signup/page.tsx

"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, Tooltip } from "@nextui-org/react";
import dynamic from "next/dynamic";
import SocialProfile from "@/components/SocialProfile";
const BgLooper = dynamic(() => import("./bg-looper").then((mod) => mod.BgLooper), {
  ssr: false,
});

// Dynamically import FullscreenWarp to prevent SSR issues
const FullscreenWarp = dynamic(() => import("./fullscreenwarp"), { ssr: false });

// Custom SVG Icon Components
const ResetIcon = () => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 24 24"
    className="text-white dark:text-gray-200"
    height="16"
    width="16"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      fill="none"
      strokeWidth="2"
      d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9"
    ></path>
  </svg>
);

const AttachIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="text-white dark:text-gray-200"
    width="16"
    height="16"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9 7C9 4.23858 11.2386 2 14 2C16.7614 2 19 4.23858 19 7V15C19 18.866 15.866 22 12 22C8.13401 22 5 18.866 5 15V9C5 8.44772 5.44772 8 6 8C6.55228 8 7 8.44772 7 9V15C7 17.7614 9.23858 20 12 20C14.7614 20 17 17.7614 17 15V7C17 5.34315 15.6569 4 14 4C12.3431 4 11 5.34315 11 7V15C11 15.5523 11.4477 16 12 16C12.5523 16 13 15.5523 13 15V9C13 8.44772 13.44772 8 14 8C14.5523 8 15 8.44772 15 9V15C15 16.6569 13.6569 18 12 18C10.3431 18 9 16.6569 9 15V7Z"
    ></path>
  </svg>
);

const TickIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-green-400 dark:text-green-300"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
      clipRule="evenodd"
    />
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

// Typing Effect Hook for Single Line
const useTypingEffect = (
  fullText: string,
  speed: number = 100,
  startTyping: boolean = true
): [string, boolean] => {
  const [typedText, setTypedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const indexRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!startTyping) return;

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
  }, [fullText, speed, startTyping]);

  return [typedText, isTypingComplete];
};

// Reusable InputField Component
const InputField: React.FC<{
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}> = ({ label, placeholder, value, onChange, onKeyDown }) => (
  <div className="mb-4">
    <label htmlFor={label} className="sr-only">
      {label}
    </label>
    <textarea
      id={label}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      rows={2}
      required
      className="w-full h-12 bg-gray-700 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg resize-none dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-blue-400"
    ></textarea>
  </div>
);

// Reusable UploadField Component
const UploadField: React.FC<{
  label: string;
  placeholder: string;
  selectedFile: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ label, placeholder, selectedFile, onFileChange }) => (
  <div className="mb-4">
    <label
      htmlFor={`file-input-${label}`}
      className="cursor-pointer flex items-center justify-between bg-gray-700 px-4 py-2 rounded-lg dark:bg-gray-800"
    >
      <span className="text-sm text-gray-300 dark:text-gray-200">
        {selectedFile ? "File attached, ready to continue" : placeholder}
      </span>
      <AttachIcon />
    </label>
    <input
      type="file"
      id={`file-input-${label}`}
      className="hidden"
      onChange={onFileChange}
    />
  </div>
);

// Progress Bar Component
const ProgressBar: React.FC<{ percentage: number }> = ({ percentage }) => (
  <div className="w-full mt-6 mb-2 flex items-center">
    <div className="w-full mr-2">
      <div className="h-2 bg-gray-600 rounded-full dark:bg-gray-700">
        <div
          className="h-2 bg-green-400 rounded-full transition-all duration-300 dark:bg-green-300"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
    <div className="text-sm text-gray-300 dark:text-gray-200">{percentage}%</div>
  </div>
);

// Progress Entry Display Component
const ProgressEntryDisplay: React.FC<{ entry: ProgressEntry }> = ({ entry }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (entry.type === "upload" && entry.value instanceof File && entry.value.type.startsWith("image/")) {
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
            {["Instagram", "TikTok", "Twitter"].includes(entry.label) && entry.value !== "No input provided" && (
              <SocialProfile
                platform={entry.label.toLowerCase() as "instagram" | "tiktok" | "twitter"}
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
              <p className="text-gray-200 dark:text-gray-100">Size: {Math.round(entry.value.size / 1024)} KB</p>
              <p className="text-gray-200 dark:text-gray-100">Type: {entry.value.type}</p>
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

const SignupPage = () => {
  // Warp State
  const [showWarp, setShowWarp] = useState(false);

  // States for Form
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [step, setStep] = useState(0); // Initialize to 0 for typing effect

  // Steps Definition
  const steps: ProgressEntry[] = [
    { type: "input", placeholder: "Enter your brand name", label: "Brand name", value: "" },
    { type: "input", placeholder: "Enter your first name", label: "First name", value: "" },
    { type: "input", placeholder: "Enter your last name", label: "Last name", value: "" },
    { type: "input", placeholder: "Enter your Instagram handle (optional)", label: "Instagram", value: "" },
    { type: "input", placeholder: "Enter your TikTok handle (optional)", label: "TikTok", value: "" },
    { type: "input", placeholder: "Enter your Twitter handle (optional)", label: "Twitter", value: "" },
    { type: "upload", placeholder: "Upload your Web Wide Logo Image (optional)", label: "Web Wide Logo Image", value: "" },
    { type: "upload", placeholder: "Upload your App Square Logo Image (optional)", label: "App Square Logo Image", value: "" },
    // Removed Web Hero Image upload step
  ];

  // Define two separate lines (Fixed typos)
  const firstLine = "Weelcome to Cicada Private Label!";
  const secondLine = "Leet's begin the adventure";

  // Use Typing Effect Hook for both lines
  const [typedText1, isTypingComplete1] = useTypingEffect(firstLine, 50, step === 0);
  const [typedText2, isTypingComplete2] = useTypingEffect(secondLine, 50, step === 1 && isTypingComplete1);

  // Move the step to 1 when the first line completes
  useEffect(() => {
    if (isTypingComplete1 && step === 0) {
      setStep(1);
    }
  }, [isTypingComplete1, step]);

  // Move the step to 2 when the second line completes
  useEffect(() => {
    if (isTypingComplete2 && step === 1) {
      setStep(2); // Start the form if both lines are complete
    }
  }, [isTypingComplete2, step]);

  // Handle Input Submission (for both text and file uploads)
  const handleInputSubmit = () => {
    if (step < 2) return; // Prevent submission before typing effect

    const currentStep = steps[step - 2];

    if (currentStep.type === "input") {
      // Basic validation for required fields
      if (["Brand name", "First name", "Last name"].includes(currentStep.label) && !currentInput.trim()) {
        alert(`${currentStep.label} is required.`);
        return;
      }

      setProgress((prev) => [
        ...prev,
        { type: "input", label: currentStep.label, value: currentInput.trim() || "No input provided" },
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
    if (step < steps.length + 2) { // Adjusted for typing steps
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
    if (step < 2) return; // Prevent reset before form starts
    const currentStep = steps[step - 2];
    if (currentStep.type === "input") {
      setCurrentInput("");
    } else if (currentStep.type === "upload") {
      setSelectedFile(null);
    }
  };

  // Calculate progress percentage for the linear progress bar
  const progressPercentage = Math.min((progress.length / steps.length) * 100, 100);

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
    <section className="relative flex flex-col items-center text-white min-h-screen px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-br from-blue-400 via-purple-500 to-blue-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-xl md:max-w-2xl">
        {/* Form Card */}
        <Card className="bg-gray-700 bg-opacity-80 dark:bg-gray-800 dark:bg-opacity-80 rounded-lg p-6 shadow-lg w-full">
          {/* Heading with Typing Effect Positioned Above Input Box */}
          <h1 className="text-lg font-semibold mb-8 drop-shadow-lg text-left text-gray-300 dark:text-gray-100">
            <span>{typedText1}</span>
            <br />
            <span>{typedText2}</span>
          </h1>

          {/* Input Area */}
          {step >= 2 && step <= steps.length + 1 && (
            <div className="relative">
              {/* Top Row: Input Field or Upload Prompt */}
              <div className="flex-1">
                {steps[step - 2]?.type === "input" ? (
                  <InputField
                    label={steps[step - 2].label}
                    placeholder={steps[step - 2].placeholder}
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                ) : steps[step - 2]?.type === "upload" ? (
                  <UploadField
                    label={steps[step - 2].label}
                    placeholder={steps[step - 2].placeholder}
                    selectedFile={selectedFile}
                    onFileChange={handleFileChange}
                  />
                ) : null}
              </div>

              {/* Bottom Row: Icons */}
              <div className="flex justify-between mt-4">
                {/* Left Icons: Attach and Reset */}
                <div className="flex space-x-2">
                  {/* Attach Icon */}
                  {steps[step - 2]?.type === "upload" ? (
                    <label
                      htmlFor={`file-input-${steps[step - 2].label}`}
                      className="cursor-pointer flex items-center justify-center"
                      aria-label="Attach file"
                    >
                      <Tooltip content="Attach File">
                        <div className="bg-black rounded-full w-10 h-10 flex items-center justify-center dark:bg-gray-700">
                          <AttachIcon />
                        </div>
                      </Tooltip>
                      <input
                        type="file"
                        id={`file-input-${steps[step - 2].label}`}
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  ) : (
                    // Inactive Attach Icon for text prompts
                    <div className="bg-black rounded-full w-10 h-10 flex items-center justify-center opacity-50 dark:bg-gray-700">
                      <AttachIcon />
                    </div>
                  )}

                  {/* Reset Icon */}
                  <button
                    onClick={handleReset}
                    className="bg-black rounded-full w-10 h-10 flex items-center justify-center cursor-pointer dark:bg-gray-700"
                    aria-label="Reset input"
                  >
                    <Tooltip content="Reset Input">
                      <ResetIcon />
                    </Tooltip>
                  </button>
                </div>

                {/* Continue Button */}
                <button
                  onClick={handleInputSubmit}
                  className={`flex items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg py-2 px-4 rounded-full shadow-lg hover:from-blue-600 hover:to-purple-700 transition-colors duration-300 ${
                    (steps[step - 2]?.type === "input" &&
                      !currentInput.trim() &&
                      ["Brand name", "First name", "Last name"].includes(steps[step - 2].label)) ||
                    (steps[step - 2]?.type === "upload" && !selectedFile)
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  aria-label="Continue"
                  disabled={
                    (steps[step - 2]?.type === "input" &&
                      !currentInput.trim() &&
                      ["Brand name", "First name", "Last name"].includes(steps[step - 2].label)) ||
                    (steps[step - 2]?.type === "upload" && !selectedFile)
                  }
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Progress Bar with Percentage */}
          {step >= 2 && (
            <ProgressBar percentage={progressPercentage} />
          )}

          {/* Progress Section */}
          {progress.length > 0 && (
            <div className="mt-4 w-full">
              {progress.map((entry, index) => (
                <ProgressEntryDisplay key={index} entry={entry} />
              ))}
            </div>
          )}

          {/* Final Continue Button (Visible After All Steps Are Completed) */}
          {progress.length === steps.length && (
            <button
              onClick={() => setShowWarp(true)}
              className="mt-6 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg py-3 rounded-full shadow-lg hover:from-blue-600 hover:to-purple-700 transition-colors duration-300 dark:from-blue-600 dark:to-purple-700"
            >
              Continue
            </button>
          )}
        </Card>
      </div>

      {/* Optional: Overlay for Fullscreen Warp */}
      {/* The FullscreenWarp component is rendered conditionally above */}
      <BgLooper />
    </section>
  );
};

export default SignupPage;
