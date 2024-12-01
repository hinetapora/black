// File: app/signup/hooks/useTypingEffect.ts

import { useState, useEffect, useRef } from "react";

/**
 * Custom hook to create a typing effect for a given text.
 * @param fullText - The complete text to display.
 * @param speed - The speed of typing in milliseconds.
 * @param startTyping - Boolean to control when typing starts.
 * @returns An array containing the currently typed text and a boolean indicating if typing is complete.
 */
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
        indexRef.current++; // Increment after adding the character
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

export default useTypingEffect;
