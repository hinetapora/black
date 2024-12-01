import React from "react";
import { Code } from "@nextui-org/react";

import {
  MoonIcon,
  MagicIcon,
  FlashIcon,
  DevicesIcon,
  ServerLinearIcon,
  TagUserLinearIcon,
  MouseCircleLinearIcon,
  CodeDocumentLinearIcon,
  HtmlLogoLinearIcon,
  CubesLinearIcon,
} from "@/components/icons";

export default {
  topFeatures: [
    {
      title: "Fast Setup",
      description:
        "Launch your branded VPN service in just 60 mins ⏰, with a streamlined onboarding process. No tech expertise required.",
      icon: <MagicIcon className="text-pink-500" />,
    },
    {
      title: "Low Maintenance",
      description:
        "We handle the infrastructure and updates 🛠️, so you can focus on growing your brand and profits.",
      icon: <FlashIcon className="text-pink-500" />,
    },
    {
      title: "Build Your Brand",
      description:
        "Customize everything 🎨—from logos to colors—to reinforce your identity, not ours.",
      icon: <MoonIcon className="text-pink-500" />,
    },
    {
      title: "Scalable Profits",
      description:
        "Earn more 💰 with a pricing structure designed to maximize your revenue as your user base grows.",
      icon: <DevicesIcon className="text-pink-500" />,
    },
  ],
  fullFeatures: [
    {
      title: "Complete Branding Control",
      description: (
        <>
          Your logo, your colors, your domain 🌟. Stand out in the market and keep customers loyal to *your* brand.
        </>
      ),
      icon: <TagUserLinearIcon className="text-pink-500" />,
    },
    {
      title: "Hands-Free Operation",
      description:
        "Our fully managed service 🤝 means no server maintenance or customer support headaches.",
      icon: <ServerLinearIcon className="text-pink-500" />,
    },
    {
      title: "Revenue Analytics",
      description:
        "Track your earnings and user growth with real-time dashboards and insights 📊.",
      icon: <CubesLinearIcon className="text-pink-500" />,
    },
    {
      title: "Global Infrastructure",
      description:
        "Tap into a worldwide server network 🌍 with zero effort on your end.",
      icon: <HtmlLogoLinearIcon className="text-pink-500" />,
    },
    {
      title: "No Tech Expertise Needed",
      description:
        "Our user-friendly platform ensures you can manage your VPN service 🔧 without any technical skills.",
      icon: <MouseCircleLinearIcon className="text-pink-500" />,
    },
    {
      title: "Support On-Demand",
      description:
        "Get comprehensive documentation and expert support whenever you need it 🛡️.",
      icon: <CodeDocumentLinearIcon className="text-pink-500" />,
    },
  ],
  themingCode: `const { vpnCustomTheme } = require("@vpn-label/react");

module.exports = {
  plugins: [
    vpnCustomTheme({
      themes: {
        light: {
          colors: {
            primary: "#1A73E8",
          },
        },
        dark: {
          colors: {
            primary: "#1A73E8",
          },
        },
      },
    }),
  ],
};
`,
  darkModeCode: `import React from "react";
import { VPNProvider } from "@vpn-label/react";

const Application = ({ Component, pageProps }) => {
  return (
    <VPNProvider>
      <main className={isDark ? "dark" : "light"}>
        <Component {...pageProps} />
      </main>
    </VPNProvider>
  );
};

export default Application;
`,
  customizationCode: `import React from "react";
import { Button } from "@nextui-org/react";

const CustomButton = () => {
  return (
    <Button
      ref={buttonRef}
      disableRipple
      className="relative overflow-visible rounded-full hover:-translate-y-1 px-12 shadow-xl bg-background/30 after:content-[''] after:absolute after:rounded-full after:inset-0 after:bg-background/40 after:z-[-1] after:transition after:!duration-500 hover:after:scale-150 hover:after:opacity-0"
      size="lg"
      onPress={handleConfetti}
    >
      Start Earning Today
    </Button>
  );
};

export default CustomButton;
`,
};
