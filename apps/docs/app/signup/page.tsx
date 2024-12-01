// File: app/signup/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Card, Tooltip } from "@nextui-org/react";
import dynamic from "next/dynamic";
import SocialProfile from "@/components/SocialProfile";

// Import Reusable Components from app/signup/components/
import InputField from "./components/InputField";
import UploadField from "./components/UploadField";
import ProgressBar from "./components/ProgressBar";
import ProgressEntryDisplay from "./components/ProgressEntryDisplay";
import { ResetIcon, AttachIcon } from "./components/Icons";

// Import Custom Hook
import useTypingEffect from "./hooks/useTypingEffect";

// Import Validation Functions
import { validateBrandName, validateSocialHandle } from "./utils/validation";

// Import Icon from Iconify
import { Icon } from "@iconify/react";
import arrowRightIcon from "@iconify/icons-solar/arrow-right-linear";

// Dynamically import FullscreenWarp to prevent SSR issues
const FullscreenWarp = dynamic(() => import("./fullscreenwarp"), { ssr: false });

// Dynamically import BgLooper
const BgLooper = dynamic(() => import("./bg-looper").then((mod) => mod.BgLooper), {
  ssr: false,
});

// Progress Entry Interfaces
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

type Step = StepInput | StepUpload;

interface StepInput {
  type: "input";
  label: string;
  placeholder: string;
  helperText?: React.ReactNode;
}

interface StepUpload {
  type: "upload";
  label: string;
  placeholder: string;
  helperText?: React.ReactNode;
}

const SignupPage = () => {
  // Warp State
  const [showWarp, setShowWarp] = useState(false);

  // States for Form
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [step, setStep] = useState(0); // Initialize to 0 for typing effect
  const [errors, setErrors] = useState<Record<number, string>>({}); // New state for errors

  // Steps Definition
  const steps: Step[] = [
    {
      type: "input",
      placeholder: "Enter your brand name",
      label: "Brand name",
      helperText: (
        <>
          🚀 🚀 This sets the Brand Name used throughout your VPN service in your Appleᵀᴹ, Androidᵀᴹ & Microsoftᵀᴹ VPN apps, your VPN website, and in your VPN service emails & invoices.
          <br />
          <br />
          While it's easy enough to change it later in the dashboard, as it's your trading name, it's not something you want to change often as this can confuse your customers.
          <br />
          <br />
          Many social ⭐stars⭐ use their social handle or personal brand like <strong>@handleVPN</strong> or <strong>stream@handle</strong>.
          <br />
          <br />
          ⚠️ Limitations: App designs limit the number of Brand Name characters to max 13 characters.
          <br />
          <br />
          Checkout our reference site at{" "}
          <a
            href="https://cicadavpn.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline hover:text-blue-500"
          >
            https://cicadavpn.com
          </a>{" "}
          to see where the Brand Name "CicadaVPN" is applied - this will be replaced with your Brand Name as your website is built in the next 60 mins ⏰.
        </>
      ),
    },
    {
      type: "input",
      placeholder: "Enter your first name",
      label: "First name",
      helperText: "Your legal first name.",
    },
    {
      type: "input",
      placeholder: "Enter your last name",
      label: "Last name",
      helperText: "Your legal last name.",
    },
    {
      type: "input",
      placeholder: "Enter your Instagram handle (optional)",
      label: "Instagram",
      helperText:
        "Provide your Instagram username in this format @handle. We use this to check eligibility and link your Instagram account into the dashboard.",
    },
    {
      type: "input",
      placeholder: "Enter your TikTok handle (optional)",
      label: "TikTok",
      helperText:
        "Provide your TikTok username in this format @handle. We use this to check eligibility and link your TikTok account into the dashboard.",
    },
    {
      type: "input",
      placeholder: "Enter your Twitter handle (optional)",
      label: "Twitter",
      helperText:
        "Provide your Twitter username in this format @handle. We use this to check eligibility and link your Twitter account into the dashboard.",
    },
    {
      type: "upload",
      placeholder: "Upload your Web Wide Logo Image (optional)",
      label: "Web Wide Logo Image",
      helperText: (
        <>
          Preferably in PNG or JPEG format, max size 2MB. We use this to add your brand to your new website. See{" "}
          <a
            href="https://cicadavpn.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline hover:text-blue-500"
          >
            https://cicadavpn.com
          </a>{" "}
          for our reference site. Your new site will look like this with custom branding images and with your own brand name applied. You can change this in your dashboard at any time.
        </>
      ),
    },
    {
      type: "upload",
      placeholder: "Upload your App Square Logo Image (optional)",
      label: "App Square Logo Image",
      helperText: (
        <>
          Preferably in PNG or JPEG format, max size 2MB. We use this to add your brand to your new Apple, Google, and Microsoft Apps. See{" "}
          <a
            href="https://cicadavpn.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline hover:text-blue-500"
          >
            https://cicadavpn.com
          </a>{" "}
          for our reference apps. Your new apps will be custom branded with this image. You can change this in your dashboard at any time, and the change will flow through to the apps when your clients next log in.
        </>
      ),
    },
    // Removed Web Hero Image upload step
  ];

  // Define two separate lines (Fixed typos)
  const firstLine = "Weelcome to the VPN Agency Onboarding!";
  const secondLine = "Leet's get you setup.";

  // Use Typing Effect Hook for both lines
  const [typedText1, isTypingComplete1] = useTypingEffect(firstLine, 50, step === 0);
  const [typedText2, isTypingComplete2] = useTypingEffect(
    secondLine,
    50,
    step === 1 && isTypingComplete1
  );

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
    let errorMessage = "";

    if (currentStep.type === "input") {
      if (["Brand name", "First name", "Last name"].includes(currentStep.label)) {
        if (!currentInput.trim()) {
          errorMessage = `${currentStep.label} is required.`;
        }

        if (currentStep.label === "Brand name") {
          const brandError = validateBrandName(currentInput.trim());
          if (brandError) {
            errorMessage = brandError;
          }
        }
      }

      // If it's a social handle, validate accordingly
      if (["Instagram", "TikTok", "Twitter"].includes(currentStep.label)) {
        const platform = currentStep.label.toLowerCase();
        errorMessage = validateSocialHandle(currentInput.trim(), platform);
      }

      if (errorMessage) {
        setErrors((prev) => ({ ...prev, [step - 2]: errorMessage }));
        return;
      } else {
        setErrors((prev) => {
          const updated = { ...prev };
          delete updated[step - 2];
          return updated;
        });
      }

      // Prepare the value to store
      let valueToStore = currentInput.trim();
      if (["Instagram", "TikTok", "Twitter"].includes(currentStep.label)) {
        valueToStore = currentInput.trim().startsWith("@")
          ? currentInput.trim().slice(1)
          : currentInput.trim();
      }

      setProgress((prev) => [
        ...prev,
        {
          type: "input",
          label: currentStep.label,
          value: valueToStore || "No input provided",
        },
      ]);
      setCurrentInput("");
    } else if (currentStep.type === "upload") {
      // Optional: Add validation for uploads if necessary
      if (selectedFile) {
        setProgress((prev) => [
          ...prev,
          {
            type: "upload",
            label: currentStep.label,
            value: selectedFile,
          },
        ]);
        setSelectedFile(null);
      } else {
        // If upload is optional and no file is selected, proceed to next step
        setProgress((prev) => [
          ...prev,
          {
            type: "upload",
            label: currentStep.label,
            value: "No file uploaded",
          },
        ]);
      }
    }

    // Proceed to next step
    if (step < steps.length + 2) {
      setStep((prev) => prev + 1);
    }
  };

  // Handle key down event for Enter key
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
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

    // Clear any existing errors for the current step
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[step - 2];
      return updated;
    });
  };

  // Calculate progress percentage for the linear progress bar
  const progressPercentage = Math.min(
    (progress.length / steps.length) * 100,
    100
  );

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
      <div className="relative z-10 md:mt-6 flex flex-col items-center w-full max-w-xl md:max-w-2xl">
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
                    helperText={steps[step - 2].helperText} // Pass helperText
                    errorText={errors[step - 2]} // Pass errorText
                    value={currentInput}
                    onChange={(e) => {
                      setCurrentInput(e.target.value);

                      // Perform real-time validation
                      const currentStep = steps[step - 2];
                      let errorMessage = "";

                      if (currentStep.type === "input") {
                        if (
                          ["Brand name", "First name", "Last name"].includes(
                            currentStep.label
                          )
                        ) {
                          if (currentStep.label === "Brand name") {
                            errorMessage = validateBrandName(
                              e.target.value.trim()
                            );
                          }
                        }

                        if (
                          ["Instagram", "TikTok", "Twitter"].includes(
                            currentStep.label
                          )
                        ) {
                          const platform = currentStep.label.toLowerCase();
                          errorMessage = validateSocialHandle(
                            e.target.value.trim(),
                            platform
                          );
                        }
                      }

                      if (errorMessage) {
                        setErrors((prev) => ({
                          ...prev,
                          [step - 2]: errorMessage,
                        }));
                      } else {
                        setErrors((prev) => {
                          const updated = { ...prev };
                          delete updated[step - 2];
                          return updated;
                        });
                      }
                    }}
                    onKeyDown={handleKeyDown}
                  />
                ) : steps[step - 2]?.type === "upload" ? (
                  <UploadField
                    label={steps[step - 2].label}
                    placeholder={steps[step - 2].placeholder}
                    helperText={steps[step - 2].helperText} // Pass helperText
                    errorText={errors[step - 2]} // Pass errorText if any
                    selectedFile={selectedFile}
                    onFileChange={handleFileChange}
                  />
                ) : null}
              </div>

              {/* Bottom Row: Icons and Continue Button */}
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

                {/* Continue Button with ProBanner Style */}
                <button
                  onClick={handleInputSubmit}
                  className={`flex group min-w-[120px] items-center font-semibold text-foreground shadow-sm gap-1.5 relative isolate overflow-hidden rounded-full p-[1px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                    (steps[step - 2]?.type === "input" &&
                      (!currentInput.trim() ||
                        (["Brand name", "Instagram", "TikTok", "Twitter"].includes(
                          steps[step - 2]?.label
                        ) &&
                          errors[step - 2]))) ||
                    (steps[step - 2]?.type === "upload" && !selectedFile)
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  aria-label="Continue"
                  disabled={
                    (steps[step - 2]?.type === "input" &&
                      (!currentInput.trim() ||
                        (["Brand name", "Instagram", "TikTok", "Twitter"].includes(
                          steps[step - 2]?.label
                        ) &&
                          errors[step - 2]))) ||
                    (steps[step - 2]?.type === "upload" && !selectedFile)
                  }
                >
                  {/* Animated Background with Proper Inset and Spin Duration */}
                  <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#F54180_0%,#338EF7_50%,#F54180_100%)] pointer-events-none" />

                  {/* Button Content */}
                  <div className="inline-flex h-full w-full items-center justify-center rounded-full bg-background group-hover:bg-background/70 transition-background px-3 py-1 text-sm font-medium text-foreground backdrop-blur-3xl relative z-10">
                    Continue
                    <Icon
                      aria-hidden="true"
                      className="outline-none transition-transform group-hover:translate-x-0.5 ml-2 [&>path]:stroke-[2px]"
                      icon={arrowRightIcon}
                      width={16}
                    />
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Progress Bar with Percentage */}
          {step >= 2 && <ProgressBar percentage={progressPercentage} />}

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
              className={`flex group min-w-[120px] items-center font-semibold text-foreground shadow-sm gap-1.5 relative isolate overflow-hidden rounded-full p-[1px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary mt-6 w-full`}
              aria-label="Continue"
            >
              {/* Animated Background with Proper Inset and Spin Duration */}
              <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#F54180_0%,#338EF7_50%,#F54180_100%)] pointer-events-none" />

              {/* Button Content */}
              <div className="inline-flex h-full w-full items-center justify-center rounded-full bg-background group-hover:bg-background/70 transition-background px-3 py-1 text-sm font-medium text-foreground backdrop-blur-3xl relative z-10">
                Continue
                <Icon
                  aria-hidden="true"
                  className="outline-none transition-transform group-hover:translate-x-0.5 [&>path]:stroke-[2px] ml-2"
                  icon={arrowRightIcon}
                  width={16}
                />
              </div>
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
