"use client";

import NextLink from "next/link";
import {Button, Link, Chip, Snippet} from "@nextui-org/react";
import {ArrowRightIcon} from "@nextui-org/shared-icons";
import dynamic from "next/dynamic";

import {FloatingComponents} from "./floating-components";
import {SupportProps} from "../partners";
import {GithubIcon} from "@/components/icons";
import {title, subtitle} from "@/components/primitives";
import {trackEvent} from "@/utils/va";

const BgLooper = dynamic(() => import("./bg-looper").then((mod) => mod.BgLooper), {
  ssr: false,
});

export const Hero = () => {
  const handlePressAnnouncement = (name: string, url: string) => {
    trackEvent("NavbarItem", {
      name,
      action: "press",
      category: "home - hero",
      data: url,
    });
  };

  return (
    <section className="flex relative overflow-hidden lg:overflow-visible w-full flex-nowrap justify-between items-center h-[calc(80vh_-_34px)] 2xl:h-[calc(54vh_-_34px)]">
      <div className="relative z-20 flex flex-col w-full gap-6 lg:w-1/2 xl:mt-4">
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


        <div className="inline-block">
          <h1 className={title()}>
            <span className=" decoration-green-500">Your&nbsp;</span>
          </h1>
          <h1 className={title({ color: "violet" })}>Brand, </h1>
          <h1 className={title()}>our </h1>
          <h1 className={title({ color: "blue" })}>Global VPN, </h1>
          <h1 className={title()}>Your
            <span>&nbsp;</span>

          </h1>
          <h1 className={`${title({ color: "green" })} `}>
          Success

          </h1>
          <span>&nbsp;&nbsp;</span>
          <span
            aria-label="rocket"
            className={`${title( )} `} 
            role="img"
          >
            🎉
          </span>

        </div>


        </div>

        <h2 className={subtitle({ fullWidth: true, class: "text-center md:text-left" })}>
  Fast, effortless, risk-free. Launch{" "}
  <span
    aria-label="rocket"
    className="hidden md:inline-block"
    role="img"
  >
    🚀
  </span>{" "}
  your private-label VPN service with Stripe payments + crypto token rewards in under 60 seconds.
  <br />
  <span className="block mt-2">
    Limited spots now open exclusively for top social influencers &{" "}
    <span className=" decoration-blue-500">visionary founders</span>{" "}
    <span
      aria-label="star"
      role="img"
      className="inline-block"
    >
      🌟
    </span>
  </span>
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
              trackEvent("Hero - Get Started", {
                name: "Get Started",
                action: "click",
                category: "landing-page",
                data: "/signup",
              });
            }}
          >
            Show me
          </Button>
          <Snippet
            className="hidden w-full rounded-full md:flex sm:w-auto"
            copyButtonProps={{
              radius: "full",
            }}
            onCopy={() => {
              trackEvent("Hero - Copy Install Command", {
                name: "Copy",
                action: "click",
                category: "landing-page",
                data: "npx nextui-cli@latest init",
              });
            }}
          >
            npx nextui-cli@latest init
          </Snippet>
{/*           <Button
            fullWidth
            isExternal
            as={Link}
            className="w-full md:hidden"
            href="https://github.com/nextui-org/nextui"
            radius="full"
            size="lg"
            startContent={<GithubIcon />}
            variant="bordered"
            onPress={() => {
              trackEvent("Hero - Github", {
                name: "Github",
                action: "click",
                category: "landing-page",
                data: "https://github.com/nextui-org/nextui",
              });
            }}
          >
            GitHub
          </Button> */}
        </div>
      </div>



      <BgLooper />
    </section>
  );
};
