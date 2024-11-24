"use client";

import React, { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";

const SignupPage = () => {
  const [typedText, setTypedText] = useState(""); // For heading typing effect
  const [placeholderText, setPlaceholderText] = useState(""); // For input placeholder typing effect
  const fullHeadingText = "Let’s get your deets";
  const placeholders = [
    "Enter your brand name",
    "Enter your first name",
    "Enter your last name",
    "Enter your country (optional)",
    "Enter your Instagram handle (optional)",
    "Enter your TikTok handle (optional)",
    "Enter your Twitter handle (optional)",
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [progress, setProgress] = useState<string[]>([]);
  const [logo, setLogo] = useState<File | null>(null);
  const [showSubmit, setShowSubmit] = useState(false);

  useEffect(() => {
    console.debug("Page has loaded.");
    
    // Typing effect for the heading
    let headingIndex = 0;
    const headingInterval = setInterval(() => {
      if (headingIndex < fullHeadingText.length) {
        setTypedText((prev) => fullHeadingText.slice(0, headingIndex + 1));
        headingIndex++;
      } else {
        clearInterval(headingInterval);
        console.debug("Heading typing complete.");

        // Start typing effect for the first placeholder
        let placeholderIndex = 0;
        const placeholderInterval = setInterval(() => {
          if (placeholderIndex < placeholders[0].length) {
            setPlaceholderText((prev) =>
              placeholders[0].slice(0, placeholderIndex + 1)
            );
            placeholderIndex++;
          } else {
            clearInterval(placeholderInterval);
            console.debug("First placeholder typing complete.");
          }
        }, 1000 / placeholders[0].length);
      }
    }, 1000 / fullHeadingText.length);

    return () => {
      clearInterval(headingInterval);
    };
  }, []);

  const typeOutProgress = (text: string) => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setProgress((prev) => [
          ...prev.slice(0, -1),
          text.slice(0, index + 1),
        ]);
        index++;
      } else {
        setProgress((prev) => [...prev, text]); // Append final completed text
        console.debug(`Progress updated: ${text}`);
        clearInterval(interval);
      }
    }, 50);
  };

  const handleInputSubmit = () => {
    console.debug(`Submitting input: "${inputValue}" for step: ${placeholders[currentStep]}`);
    
    if (!inputValue.trim()) {
      typeOutProgress("Please enter a valid input.");
      console.warn("Empty input submitted.");
      return;
    }

    // Append to progress
    const label = placeholders[currentStep]
      .replace("Enter your ", "")
      .replace(" (optional)", "");
    typeOutProgress(`${label}: "${inputValue}"`);

    // Move to the next step
    setInputValue("");
    if (currentStep === placeholders.length - 1) {
      setShowSubmit(true);
      console.debug("All steps completed. Submit button is now visible.");
    } else {
      setCurrentStep((prev) => prev + 1);
      console.debug(`Moving to next step: ${placeholders[currentStep + 1]}`);
      
      const nextPlaceholder = placeholders[currentStep + 1];
      let placeholderIndex = 0;
      const placeholderInterval = setInterval(() => {
        if (placeholderIndex < nextPlaceholder.length) {
          setPlaceholderText((prev) =>
            nextPlaceholder.slice(0, placeholderIndex + 1)
          );
          placeholderIndex++;
        } else {
          clearInterval(placeholderInterval);
          console.debug(`Placeholder updated to: "${nextPlaceholder}"`);
        }
      }, 1000 / nextPlaceholder.length);
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.debug(`Logo uploaded: ${file.name}`);
      setLogo(file);

      // Fetch and print file meta
      const img = new Image();
      img.onload = () => {
        const meta = `Logo: ${file.name} (${file.type}), ${img.width}x${img.height}px`;
        typeOutProgress(meta);
        setShowSubmit(true);
        console.debug("Logo upload complete. Meta data added to progress.");
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const handleRestart = () => {
    console.debug("Restarting the form...");
    setTypedText("");
    setPlaceholderText("");
    setInputValue("");
    setProgress([]);
    setLogo(null);
    setShowSubmit(false);
    setCurrentStep(0);

    // Restart typing animation
    let headingIndex = 0;
    const headingInterval = setInterval(() => {
      if (headingIndex < fullHeadingText.length) {
        setTypedText((prev) => fullHeadingText.slice(0, headingIndex + 1));
        headingIndex++;
      } else {
        clearInterval(headingInterval);
        let placeholderIndex = 0;
        const placeholderInterval = setInterval(() => {
          if (placeholderIndex < placeholders[0].length) {
            setPlaceholderText((prev) =>
              placeholders[0].slice(0, placeholderIndex + 1)
            );
            placeholderIndex++;
          } else {
            clearInterval(placeholderInterval);
          }
        }, 1000 / placeholders[0].length);
      }
    }, 1000 / fullHeadingText.length);
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-black relative text-green-400 font-arcade">
      {/* Typing Animated Heading */}
      <h1 className="text-3xl arcade-text-glow">{typedText}</h1>

      {/* Chat Interface */}
      <div className="mt-6 w-full max-w-md flex flex-col space-y-4">
        {/* Input Area */}
        <div className="relative">
          <textarea
            placeholder={placeholderText}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (currentStep === 1) return; // Skip input submission for logo upload step
                handleInputSubmit();
              }
            }}
            className="w-full h-20 rounded-lg bg-gray-900 text-green-400 px-4 pt-2 focus:outline-none resize-none arcade-border"
          ></textarea>
          {currentStep !== 1 && !showSubmit && (
            <button
              onClick={handleInputSubmit}
              className="absolute bottom-2 right-4 bg-green-400 hover:bg-green-600 text-black rounded-full p-2 flex items-center justify-center"
              style={{ width: "30px", height: "30px" }}
            >
              <FaArrowUp className="text-sm" />
            </button>
          )}
          {currentStep === 1 && (
            <div className="absolute bottom-2 right-4">
              <label
                htmlFor="logo-upload"
                className="cursor-pointer flex items-center justify-center"
                style={{ width: "30px", height: "30px" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-green-400"
                  width="24"
                  height="24"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9 7C9 4.23858 11.2386 2 14 2C16.7614 2 19 4.23858 19 7V15C19 18.866 15.866 22 12 22C8.13401 22 5 18.866 5 15V9C5 8.44772 5.44772 8 6 8C6.55228 8 7 8.44772 7 9V15C7 17.7614 9.23858 20 12 20C14.7614 20 17 17.7614 17 15V7C17 5.34315 15.6569 4 14 4C12.3431 4 11 5.34315 11 7V15C11 15.5523 11.4477 16 12 16C12.5523 16 13 15.5523 13 15V9C13 8.44772 13.4477 8 14 8C14.5523 8 15 8.44772 15 9V15C15 16.6569 13.6569 18 12 18C10.3431 18 9 16.6569 9 15V7Z"
                  ></path>
                </svg>
              </label>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
              />
            </div>
          )}
        </div>

        {/* Step Messages */}
        <div className="mt-4">
          {progress.map((item, index) => (
            <p key={index} className="text-sm text-green-400">
              {item}
            </p>
          ))}
          {logo && (
            <div className="mt-2">
              <img
                src={URL.createObjectURL(logo)}
                alt="Uploaded Logo"
                className="w-16 h-16 object-cover rounded-md arcade-border"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        {showSubmit && (
          <button
            onClick={() => alert("Submitting details!")}
            className="mt-4 w-full bg-green-400 text-black text-lg py-2 rounded-lg arcade-border"
          >
            Submit
          </button>
        )}

        {/* Restart Link */}
        <button
          onClick={handleRestart}
          className="text-sm text-green-400 underline mt-4"
        >
          Restart
        </button>
      </div>
    </section>
  );
};

export default SignupPage;
