// app/auth/page.tsx

"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Card,
  Input,
  Button,
  Checkbox,
  Link,
  Spacer,
  Divider,
} from "@nextui-org/react";
import { FaApple, FaGoogle, FaEye, FaEyeSlash, FaTimes } from "react-icons/fa"; // Added FaTimes for clear button
import { supabase } from "@/utils/supabaseClient";
import { validateEmail, validatePassword } from "@/utils/validation"; // Import validation functions

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showEmailSignUp, setShowEmailSignUp] = useState(false);
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setShowEmailSignUp(false);
    setShowEmailLogin(false);
    setError(null);
    setShowPassword(false); // Reset password visibility when toggling mode
    setShowConfirmPassword(false); // Reset confirm password visibility when toggling mode
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
  
    // Validate Email
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
  
    // Validate Password
    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters."
      );
      return;
    }
  
    if (isLogin) {
      if (showEmailLogin) {
        // Handle Login with Email
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
  
        if (error) {
          setError(error.message ?? "An unknown error occurred");
        } else {
          router.push("/account");
        }
      }
    } else {
      if (showEmailSignUp) {
        // Handle Sign Up with Email
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          return;
        }
  
        if (!terms) {
          setError("You must agree to the Terms and Privacy Policy.");
          return;
        }
  
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/account`,
          },
        });
  
        if (error) {
          setError(error.message ?? "An unknown error occurred");
        } else {
          // **Set the 'justSignedUp' flag in localStorage**
          if (typeof window !== "undefined") {
            localStorage.setItem("justSignedUp", "true");
          }
          // **Redirect to /account**
          router.push("/account");
        }
      }
    }
  };
  

  const handleOAuthLogin = async (provider: "apple" | "google") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/account`,
      },
    });

    if (error) {
      setError(error.message ?? "An unknown error occurred");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card
        className="
          max-w-3xl 
          lg:max-w-4xl
          w-full 
          flex 
          flex-col 
          lg:flex-row 
          p-6 
          bg-card 
          rounded-lg
          shadow-lg
          dark:bg-gray-800
        "
      >
        {/* Left Section: Form */}
        <div
          className={`
            flex-1
            flex 
            flex-col 
            items-center 
            justify-center 
            p-8 
            bg-card 
            rounded-tl-lg 
            rounded-bl-lg 
            lg:rounded-tr-lg 
            lg:rounded-bl-none 
            ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
            transition-opacity 
            transition-transform 
            duration-500 
            dark:bg-gray-800
          `}
        >
          {/* Logo Section */}
          <div className="flex justify-center w-full mb-6">
            <div
              className="flex-shrink-0"
              style={{ width: "60px", height: "60px" }}
            >
              {/* Light Mode Logo */}
              <Image
                src="/images/1024_black.png"
                alt="Logo"
                width={60}
                height={60}
                className="object-contain dark:hidden"
              />
              {/* Dark Mode Logo */}
              <Image
                src="/images/1024_white.png"
                alt="Logo"
                width={60}
                height={60}
                className="object-contain hidden dark:block"
              />
            </div>
          </div>

          {/* Form Title */}
          <h3 className="text-center mb-6 text-text text-2xl font-semibold dark:text-white">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h3>

          {/* Social Login Buttons */}
          <div className="flex flex-col items-center w-full max-w-xs mx-auto space-y-4">
            <Button
              variant="bordered"
              color="primary"
              aria-label={isLogin ? "Log In with Google" : "Sign Up with Google"}
              startContent={<FaGoogle />}
              onClick={() => handleOAuthLogin("google")}
              className="dark:bg-gray-300 justify-start rounded-full w-full"
            >
              {isLogin ? "Continue with Google" : "Sign Up with Google"}
            </Button>
            <Button
              variant="bordered"
              color="primary"
              aria-label={isLogin ? "Log In with Apple" : "Sign Up with Apple"}
              startContent={<FaApple />}
              onClick={() => handleOAuthLogin("apple")}
              className="dark:bg-gray-300 justify-start rounded-full w-full"
            >
              {isLogin ? "Continue with Apple" : "Sign Up with Apple"}
            </Button>
          </div>

          {/* Divider */}
          <Divider className="w-full my-6 dark:border-gray-600" />

          {/* Conditional Buttons for Email Authentication */}
          {isLogin ? (
            <>
              {!showEmailLogin && (
                <div className="flex justify-center w-full max-w-xs mx-auto">
                  <Button
                    variant="flat"
                    color="primary"
                    aria-label="Login with Email"
                    onClick={() => setShowEmailLogin(true)}
                    className="mb-4 dark:bg-gray-100 justify-start rounded-full w-full"
                  >
                    Login with Email
                  </Button>
                </div>
              )}

              {/* Authentication Form for Login with Email */}
              {showEmailLogin && (
                <div className="flex flex-col items-center w-full max-w-xs mx-auto">
                  <form onSubmit={handleAuth} className="w-full">
                    {/* Email Input */}
                    <label htmlFor="login-email" className="sr-only">
                      Email
                    </label>
                    <Input
                      id="login-email"
                      color="primary"
                      size="lg"
                      placeholder="Email"
                      type="email"
                      value={email}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setEmail(e.target.value)
                      }
                      required
                      autoComplete="email" // Enable browser autocomplete
                      className="mb-4 rounded dark:bg-gray-800 dark:text-white dark:border-gray-600 w-full"
                      endContent={
                        <div className="flex items-center space-x-2">
                          {email && (
                            <button
                              type="button"
                              onClick={() => setEmail("")}
                              className="text-gray-500 dark:text-gray-300 focus:outline-none"
                              aria-label="Clear email"
                            >
                              <FaTimes />
                            </button>
                          )}
                        </div>
                      }
                    />

                    {/* Password Input with Reveal/Hide */}
                    <label htmlFor="login-password" className="sr-only">
                      Password
                    </label>
                    <Input
                      id="login-password"
                      color="primary"
                      size="lg"
                      placeholder="Password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setPassword(e.target.value)
                      }
                      required
                      autoComplete="current-password" // Enable browser password suggestions
                      className="mb-4 rounded dark:bg-gray-800 dark:text-white dark:border-gray-600 w-full"
                      endContent={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-gray-500 dark:text-gray-300 focus:outline-none"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      }
                    />

                    {/* Remember and Forgot Password */}
                    <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-8">
                      <Checkbox
                        isSelected={remember}
                        onChange={() => setRemember(!remember)}
                        color="primary"
                        className="dark:text-white"
                        // Removed 'required' to make it optional
                      >
                        <span className="text-sm">Remember for 30 days</span>
                      </Checkbox>
                      <Link
                        href="/forgot-password"
                        color="primary"
                        className="text-center sm:text-left dark:text-blue-400"
                      >
                        <span className="text-sm">Forgot password?</span>
                      </Link>
                    </div>

                    {/* Error Message */}
                    {error && <p className="text-red-500 mb-4">{error}</p>}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      color="primary"
                      aria-label="Log In"
                      className="rounded-full w-full"
                    >
                      Log In
                    </Button>
                  </form>
                </div>
              )}
            </>
          ) : (
            <>
              {!showEmailSignUp && (
                <div className="flex justify-center w-full max-w-xs mx-auto">
                  <Button
                    variant="flat"
                    color="primary"
                    aria-label="Sign Up with Email"
                    onClick={() => setShowEmailSignUp(true)}
                    className="mb-4 dark:bg-gray-100 justify-start rounded-full w-full"
                  >
                    Sign Up with Email
                  </Button>
                </div>
              )}

              {/* Authentication Form for Sign Up with Email */}
              {showEmailSignUp && (
                <div className="flex flex-col items-center w-full max-w-xs mx-auto">
                  <form onSubmit={handleAuth} className="w-full">
                    {/* Email Input */}
                    <label htmlFor="signup-email" className="sr-only">
                      Email
                    </label>
                    <Input
                      id="signup-email"
                      color="primary"
                      size="lg"
                      placeholder="Email"
                      type="email"
                      value={email}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setEmail(e.target.value)
                      }
                      required
                      autoComplete="email"
                      className="mb-4 rounded dark:bg-gray-800 dark:text-white dark:border-gray-600 w-full"
                      endContent={
                        <div className="flex items-center space-x-2">
                          {email && (
                            <button
                              type="button"
                              onClick={() => setEmail("")}
                              className="text-gray-500 dark:text-gray-300 focus:outline-none"
                              aria-label="Clear email"
                            >
                              <FaTimes />
                            </button>
                          )}
                        </div>
                      }
                    />

                    {/* Password Input with Reveal/Hide */}
                    <label htmlFor="signup-password" className="sr-only">
                      Password
                    </label>
                    <Input
                      id="signup-password"
                      color="primary"
                      size="lg"
                      placeholder="Password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setPassword(e.target.value)
                      }
                      required
                      autoComplete="new-password" // Enable browser to suggest strong passwords
                      className="mb-4 rounded dark:bg-gray-800 dark:text-white dark:border-gray-600 w-full"
                      endContent={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-gray-500 dark:text-gray-300 focus:outline-none"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      }
                    />

                    {/* Confirm Password Input with Reveal/Hide */}
                    <label htmlFor="signup-confirm-password" className="sr-only">
                      Confirm Password
                    </label>
                    <Input
                      id="signup-confirm-password"
                      color="primary"
                      size="lg"
                      placeholder="Confirm Password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setConfirmPassword(e.target.value)
                      }
                      required
                      autoComplete="new-password"
                      className="mb-4 rounded dark:bg-gray-800 dark:text-white dark:border-gray-600 w-full"
                      endContent={
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="text-gray-500 dark:text-gray-300 focus:outline-none"
                          aria-label={
                            showConfirmPassword
                              ? "Hide confirm password"
                              : "Show confirm password"
                          }
                        >
                          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      }
                    />

                    {/* Terms and Privacy Policy */}
                    <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-8">
                      <Checkbox
                        isSelected={terms}
                        onChange={() => setTerms(!terms)}
                        color="primary"
                        className="dark:text-white"
                        required // Makes checkbox mandatory
                      >
                        I agree to the{" "}
                        <Link
                          href="/terms"
                          color="primary"
                          className="dark:text-blue-400"
                        >
                          Terms
                        </Link>{" "}
                        &{" "}
                        <Link
                          href="/privacy"
                          color="primary"
                          className="dark:text-blue-400"
                        >
                          Privacy Policy
                        </Link>
                      </Checkbox>
                    </div>

                    {/* Error Message */}
                    {error && <p className="text-red-500 mb-4">{error}</p>}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      color="primary"
                      aria-label="Sign Up"
                      className="rounded-full w-full"
                    >
                      Sign Up
                    </Button>
                  </form>
                </div>
              )}
            </>
          )}

          {/* Toggle Link */}
          <Spacer y={1} />

          <p className="text-center text-sm text-text dark:text-white">
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <Link
              href="#"
              color="primary"
              onClick={toggleMode}
              className="dark:text-blue-400 text-sm"
            >
              {isLogin ? "Sign Up" : "Log In"}
            </Link>
          </p>
        </div>

        {/* Right Section: Testimonial */}
        <div
          className="
            flex-1 
            bg-cover 
            bg-center 
            rounded-tr-lg 
            rounded-br-lg 
            hidden lg:block 
            shadow-lg 
            dark:bg-gray-700
          "
          style={{
            backgroundImage:
              "url('https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/white-building.jpg')",
          }}
        >
          {/* Overlay with Testimonial Text */}
          <div className="flex items-center justify-center h-full bg-black bg-opacity-50">
            <p className="text-white text-xl p-4 max-w-md text-center">
              "CicadaVPN has revolutionized my online security. It's fast, reliable, and incredibly easy to use!"
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
