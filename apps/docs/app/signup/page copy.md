"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardBody, Input, Button, Checkbox, Tooltip } from "@nextui-org/react";
import { FaInfoCircle } from "react-icons/fa";
import dynamic from "next/dynamic";

const FullscreenWarp = dynamic(() => import("./fullscreenwarp"), { ssr: false });

const SignupPage = () => {
  const [showWarp, setShowWarp] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [tagline, setTagline] = useState("");
  const [logo, setLogo] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogo(URL.createObjectURL(file));
    }
  };

  const handleLaunch = () => {
    if (!brandName || !agreed) {
      alert("Please complete all required fields.");
      return;
    }
    setShowWarp(true);
  };

  const handleWarpComplete = () => {
    window.location.href = "/dashboard"; // Redirect to the dashboard after warp
  };

  if (showWarp) {
    return <FullscreenWarp onWarpComplete={handleWarpComplete} />;
  }

  return (
    <section className="relative flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md shadow-lg dark:shadow-xl z-10 p-6 space-y-8">
        <CardHeader className="text-center flex flex-col items-center pb-0">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Build Your VPN Brand
          </h3>
        </CardHeader>
        <CardBody className="space-y-6">
          <Input
            label="Brand Name"
            placeholder="Enter your VPN brand name"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            required
          />
          <Input
            label="Tagline (Optional)"
            placeholder="Add a tagline for your brand"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
          />
          <div className="relative">
            <Input
              label="Logo Upload (Optional)"
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
            />
            <Tooltip
              placement="top"
              color="secondary"
              content={
                <div>
                  <strong>Recommended:</strong>
                  <br />- <b>SVG:</b> 200px wide x 46px high (Web)
                  <br />- <b>PNG:</b> 1024x1024px (Apps)
                  <br />
                  Your assets can be refined later with help from our brand management team.
                </div>
              }
            >
              <span>
                <FaInfoCircle
                  className="text-gray-500 dark:text-gray-300 cursor-pointer"
                  size={20}
                />
              </span>
            </Tooltip>
            {logo && (
              <div className="mt-4">
                <img src={logo} alt="Logo Preview" className="w-full rounded-md shadow" />
              </div>
            )}
          </div>
          <Checkbox
            isSelected={agreed}
            onValueChange={setAgreed}
            className="text-gray-700 dark:text-gray-300"
          >
            I agree to the{" "}
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 underline"
            >
              terms and privacy policy
            </a>
          </Checkbox>
          <Button
            onClick={handleLaunch}
            color="primary"
            className="w-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg py-3"
          >
            Launch 🚀
          </Button>
        </CardBody>
      </Card>
    </section>
  );
};

export default SignupPage;
