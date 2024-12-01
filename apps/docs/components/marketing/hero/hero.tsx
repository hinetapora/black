// components/Hero.tsx

"use client";

import NextLink from "next/link";
import { Button, Chip } from "@nextui-org/react";
import { ArrowRightIcon } from "@nextui-org/shared-icons";
import dynamic from "next/dynamic";
import { usePostHog } from "posthog-js/react";

import { GithubIcon } from "@/components/icons";
import { title, subtitle } from "@/components/primitives";

const BgLooper = dynamic(() => import("./bg-looper").then((mod) => mod.BgLooper), {
  ssr: false,
});

export const Hero = () => {
  const posthog = usePostHog();

  const handlePressAnnouncement = (name: string, url: string) => {
    posthog.capture("NavbarItem", {
      name,
      action: "press",
      category: "home - hero",
      data: url,
    });
  };

  return (
    <section className="flex relative overflow-hidden lg:overflow-visible w-full flex-nowrap justify-between items-center h-[calc(100vh_-_24px)] 2xl:h-[calc(84vh_-_64px)]">
      <div className="relative z-20 flex flex-col w-full gap-6 lg:w-1/2 xl:mt-5">
        <div className="flex justify-center w-full md:hidden">
          <Chip
            as={NextLink}
            className="transition-colors cursor-pointer bg-default-100/50 hover:bg-default-100 border-default-200/80 dark:border-default-100/80"
            color="default"
            href="/blog/v2.3.0"
            variant="dot"
            onClick={() => handlePressAnnouncement("New version v2.4.0", "/blog/v2.4.0")}
          >
            New version v2.4.0&nbsp;
            <span aria-label="emoji" role="img">
              🚀
            </span>
          </Chip>
        </div>
        <div className="leading-8 text-center md:leading-10 md:text-left">
          <div className="inline-block mb-6">
            <h1 className={title()}>Your&nbsp;</h1>
            <h1 className={title({ color: "violet" })}>Powerful Brand,&nbsp;</h1>
            <h1 className={title()}>our Global Network. </h1>
          </div>

          <div className="inline-block">
          <h1 className={title()}> 💰💰 Monetise your own&nbsp;</h1>
          <h1 className={title({ color: "green" })}>Beautiful VPN Service&nbsp;</h1>
          <h1 className={title()}>right now.</h1>
          </div>
        </div>
        <h2 className={subtitle({ fullWidth: true, class: "text-center md:text-left" })}>
        🚀 🚀 Exclusive opportunity: Private label our global VPN to launch your own premium branded service today. <strong style={{ color: 'white' }}>Join for free</strong>, <strong style={{ color: 'white' }}>50/50 rev-share</strong> (stage 1 founders only), up and running 🏃 <strong style={{ color: 'white' }}> in 60 minutes ⏰</strong>. Limited slots available – apply now.
        </h2>
        <div className="flex flex-col items-center gap-4 md:flex-row">
          <Button
            as={NextLink}
            className="w-full md:h-11 md:w-auto"
            color="primary"
            endContent={
              <ArrowRightIcon
                className="group-data-[hover=true]:translate-x-0.5 outline-none transition-transform"
                strokeWidth={2}
              />
            }
            href="/signup"
            radius="full"
            size="lg"
            onPress={() => {
              posthog.capture("Hero - Get Started", {
                name: "Get Started",
                action: "click",
                category: "landing-page",
                data: "/docs/guide/introduction",
              });
            }}
          >
            Get Started in 60s
          </Button>

          <Button
            as={NextLink}
            className="w-full md:h-11 md:w-auto bg-gray-800/60 text-white font-normal text-sm hover:bg-gray-700/90 transition-colors duration-300"
            color="default"
            endContent={
              <ArrowRightIcon
                className="group-data-[hover=true]:translate-x-0.5 outline-none transition-transform"
                strokeWidth={2}
              />
            }
            href="/signup"
            radius="full"
            size="lg"
            onPress={() => {
              posthog.capture("Hero - Just Show Me", {
                name: "Just Show Me",
                action: "click",
                category: "landing-page",
                data: "/signup",
              });
            }}
          >
            $ Just Show Me The Money
          </Button>
        </div>
      </div>

      {/* Video Container: Visible Only on Large Screens (Desktop) */}
      <div className="relative z-10 hidden lg:block lg:w-1/2">
        <video
          src="/hero_ascii_v2.mp4"
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          // Optionally, add poster for better UX before video loads
          poster="/path-to-poster-image.jpg"
        >
          Your browser does not support the video tag.
        </video>
      </div>

      <BgLooper />
    </section>
  );
};
