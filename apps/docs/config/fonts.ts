import { Inter } from "next/font/google";
import { Press_Start_2P } from "next/font/google"; // Import the arcade font

// Sans-serif font (default Inter)
export const fontSans = Inter({
  variable: "--font-sans",
  adjustFontFallback: true,
  display: "optional",
  fallback: [
    "ui-sans-serif",
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    '"Helvetica Neue"',
    "Arial",
    '"Noto Sans"',
    "sans-serif",
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
    '"Noto Color Emoji"',
  ],
  preload: true,
  style: "normal",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

// Arcade-style font (Press Start 2P)
export const fontArcade = Press_Start_2P({
  variable: "--font-arcade", // Define a CSS variable for this font
  adjustFontFallback: true,
  display: "swap",
  fallback: [
    "monospace",
    "Courier New",
    "ui-monospace",
    "SFMono-Regular",
    "Menlo",
    "Consolas",
    "Liberation Mono",
  ],
  preload: true,
  subsets: ["latin"],
  weight: "400", // Required property
});
