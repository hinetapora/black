"use client";

import { useState, FC, useEffect } from "react";
import { supabase } from "@/utils/supabaseClient";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "@nextui-org/shared-utils";
import { ThemeSwitch } from "@/components";
import { MobileDrawer } from "@/components/MobileDrawer";
import { FaBars, FaArrowRight, FaUserCircle, FaRegCreditCard, FaLock, FaMobileAlt, FaUserFriends, FaTicketAlt } from "react-icons/fa";
import { trackEvent } from "@/utils/va";

export const Navbar: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [pathname]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
      return;
    }
    window.location.href = '/auth';
  };

  const handleSelect = (section: string) => {
    console.log(`Selected section: ${section}`);
  };

  const accountLinks = [
    { href: "/account", label: "Account", icon: <FaUserCircle /> },
    { href: "/membership", label: "Membership", icon: <FaRegCreditCard /> },
    { href: "/security", label: "Security", icon: <FaLock /> },
    { href: "/devices", label: "Devices", icon: <FaMobileAlt /> },
    { href: "/accounts", label: "Accounts", icon: <FaUserFriends /> },
    { href: "/vouchers", label: "Vouchers", icon: <FaTicketAlt /> },
  ];

  const navLinkClasses = clsx("text-foreground", "data-[active=true]:text-primary");

  return (
    <>
      <NextUINavbar
        className={clsx({
          "z-[100001]": isMenuOpen,
          "bg-transparent": true,
        })}
        maxWidth="full"
        position="sticky"
      >
        {/* Left section: Logo */}
        <NavbarContent className="basis-1/4 bg-transparent" justify="start">
          <NavbarBrand as="li" className="gap-3">
            <NextLink
              aria-label="Home"
              className="flex justify-start items-center gap-2 tap-highlight-transparent transition-opacity active:opacity-50"
              href="/"
              onClick={() => trackEvent("NavbarItem", { name: "Home", action: "press", category: "navbar" })}
            >
              {/* Add both light and dark mode logos */}
              <div className="logo-container">
               

                {/* Dark mode logo */}
                <svg className="dark-logo h-8 md:h-10" fill="currentColor" viewBox="0 0 200 46">
                  {/* Dark mode SVG paths */}
                  <path d="M10.92 34.286C8.892 34.286 7.15 33.896 5.694 33.116C4.238 32.336 3.12 31.2353 2.34 29.814C1.57733 28.3927 1.196 26.7287 1.196 24.822C1.196 22.9153 1.57733 21.26 2.34 19.856C3.12 18.4347 4.238 17.334 5.694 16.554C7.15 15.774 8.892 15.384 10.92 15.384C12.1333 15.384 13.3033 15.566 14.43 15.93C15.5567 16.294 16.4667 16.788 17.16 17.412L15.73 21.182C14.9673 20.6273 14.2047 20.22 13.442 19.96C12.6793 19.6827 11.8993 19.544 11.102 19.544C9.49 19.544 8.27667 20.0033 7.462 20.922C6.64733 21.8233 6.24 23.1233 6.24 24.822C6.24 26.538 6.64733 27.8553 7.462 28.774C8.27667 29.6753 9.49 30.126 11.102 30.126C11.8993 30.126 12.6793 29.996 13.442 29.736C14.2047 29.4587 14.9673 29.0427 15.73 28.488L17.16 32.258C16.4667 32.8647 15.5567 33.3587 14.43 33.74C13.3033 34.104 12.1333 34.286 10.92 34.286ZM19.5136 34V15.67H24.2976V34H19.5136ZM36.8692 34.286C34.8412 34.286 33.0992 33.896 31.6432 33.116C30.1872 32.336 29.0692 31.2353 28.2892 29.814C27.5266 28.3927 27.1452 26.7287 27.1452 24.822C27.1452 22.9153 27.5266 21.26 28.2892 19.856C29.0692 18.4347 30.1872 17.334 31.6432 16.554C33.0992 15.774 34.8412 15.384 36.8692 15.384C38.0826 15.384 39.2526 15.566 40.3792 15.93C41.5059 16.294 42.4159 16.788 43.1092 17.412L41.6792 21.182C40.9166 20.6273 40.1539 20.22 39.3912 19.96C38.6286 19.6827 37.8486 19.544 37.0512 19.544C35.4392 19.544 34.2259 20.0033 33.4112 20.922C32.5966 21.8233 32.1892 23.1233 32.1892 24.822C32.1892 26.538 32.5966 27.8553 33.4112 28.774C34.2259 29.6753 35.4392 30.126 37.0512 30.126C37.8486 30.126 38.6286 29.996 39.3912 29.736C40.1539 29.4587 40.9166 29.0427 41.6792 28.488L43.1092 32.258C42.4159 32.8647 41.5059 33.3587 40.3792 33.74C39.2526 34.104 38.0826 34.286 36.8692 34.286ZM42.9481 34L51.5281 15.67H55.2981L63.8781 34H59.0941L56.9361 28.956L58.7561 30.282H48.0441L49.8901 28.956L47.7321 34H42.9481ZM53.3741 20.662L50.3581 27.864L49.6301 26.616H57.1961L56.4681 27.864L53.4261 20.662H53.3741ZM64.9882 34V15.67H72.5802C74.6949 15.67 76.4976 16.034 77.9882 16.762C79.4789 17.4727 80.6142 18.5127 81.3942 19.882C82.1916 21.234 82.5902 22.8807 82.5902 24.822C82.5902 26.7633 82.1916 28.4187 81.3942 29.788C80.6142 31.1573 79.4789 32.206 77.9882 32.934C76.4976 33.6447 74.6949 34 72.5802 34H64.9882ZM69.7722 30.126H72.2682C74.0882 30.126 75.4316 29.6927 76.2982 28.826C77.1822 27.942 77.6242 26.6073 77.6242 24.822C77.6242 23.0193 77.1822 21.6933 76.2982 20.844C75.4142 19.9773 74.0709 19.544 72.2682 19.544H69.7722V30.126ZM82.7606 34L91.3406 15.67H95.1106L103.691 34H98.9066L96.7486 28.956L98.5686 30.282H87.8566L89.7026 28.956L87.5446 34H82.7606ZM93.1866 20.662L90.1706 27.864L89.4426 26.616H97.0086L96.2806 27.864L93.2386 20.662H93.1866Z" fill="white"/>
                  
                  <path d="M102.062 23.132C101.446 23.132 100.87 23.02 100.334 22.796C99.806 22.572 99.346 22.264 98.954 21.872C98.562 21.48 98.254 21.02 98.03 20.492C97.806 19.956 97.694 19.38 97.694 18.764C97.694 18.148 97.806 17.576 98.03 17.048C98.254 16.52 98.562 16.06 98.954 15.668C99.346 15.276 99.806 14.968 100.334 14.744C100.862 14.52 101.438 14.408 102.062 14.408C102.678 14.408 103.25 14.52 103.778 14.744C104.306 14.968 104.766 15.276 105.158 15.668C105.55 16.06 105.858 16.52 106.082 17.048C106.306 17.576 106.418 18.148 106.418 18.764C106.418 19.38 106.306 19.956 106.082 20.492C105.858 21.02 105.55 21.48 105.158 21.872C104.766 22.264 104.306 22.572 103.778 22.796C103.25 23.02 102.678 23.132 102.062 23.132ZM102.062 22.424C102.582 22.424 103.062 22.332 103.502 22.148C103.942 21.964 104.322 21.708 104.642 21.38C104.97 21.044 105.222 20.656 105.398 20.216C105.582 19.768 105.674 19.284 105.674 18.764C105.674 18.244 105.582 17.764 105.398 17.324C105.222 16.876 104.97 16.488 104.642 16.16C104.322 15.832 103.942 15.576 103.502 15.392C103.062 15.208 102.582 15.116 102.062 15.116C101.542 15.116 101.062 15.208 100.622 15.392C100.182 15.576 99.798 15.832 99.47 16.16C99.142 16.488 98.886 16.876 98.702 17.324C98.526 17.764 98.438 18.244 98.438 18.764C98.438 19.284 98.526 19.768 98.702 20.216C98.886 20.656 99.142 21.044 99.47 21.38C99.798 21.708 100.182 21.964 100.622 22.148C101.062 22.332 101.542 22.424 102.062 22.424ZM100.118 21.296V16.22H102.398C102.982 16.22 103.426 16.364 103.73 16.652C104.042 16.932 104.198 17.292 104.198 17.732C104.198 18.196 104.046 18.552 103.742 18.8C103.446 19.04 103.026 19.16 102.482 19.16L102.818 19.028C103.082 19.028 103.298 19.096 103.466 19.232C103.634 19.36 103.766 19.62 103.862 20.012L104.246 21.296H102.866L102.458 19.832C102.41 19.672 102.334 19.564 102.23 19.508C102.134 19.452 102.018 19.424 101.882 19.424H101.27L101.486 19.28V21.296H100.118ZM101.474 18.428H102.206C102.446 18.428 102.622 18.38 102.734 18.284C102.854 18.188 102.914 18.032 102.914 17.816C102.914 17.6 102.854 17.444 102.734 17.348C102.614 17.252 102.438 17.204 102.206 17.204H101.474V18.428Z" fill="white"/>

                  <rect x="116" y="11" width="77" height="29" fill="black"/>
                  
                  <path fillRule="evenodd" clipRule="evenodd" d="M122.072 4.00004C115.997 3.98327 111.06 8.89451 111.045 14.9696L111 33.2923C110.985 39.3674 115.898 44.3058 121.973 44.3226L187.939 44.5047C194.014 44.5215 198.951 39.6103 198.966 33.5352L199.011 15.2125C199.026 9.1374 194.113 4.19895 188.038 4.18217L122.072 4.00004ZM119.657 13.44L129.929 36H134.601L144.905 13.44H138.857L132.393 28.4477L125.929 13.44H119.657ZM146.191 13.44V36H152.079V28.224H157.039C158.746 28.224 160.197 27.936 161.391 27.36C162.586 26.7627 163.493 25.9093 164.111 24.8C164.751 23.6693 165.071 22.3467 165.071 20.832C165.071 19.2747 164.751 17.952 164.111 16.864C163.493 15.7547 162.586 14.912 161.391 14.336C160.197 13.7387 158.746 13.44 157.039 13.44H146.191ZM156.015 23.712H152.079V17.952H156.015C157.125 17.952 157.978 18.1867 158.575 18.656C159.173 19.1253 159.471 19.8507 159.471 20.832C159.471 21.792 159.173 22.5173 158.575 23.008C157.978 23.4773 157.125 23.712 156.015 23.712ZM167.816 13.44V36H173.288V23.04L183.656 36H187.944V13.44H182.504V26.3706L172.136 13.44H167.816Z" fill="white"/>

                </svg>
              </div>
            </NextLink>
          </NavbarBrand>
        </NavbarContent>

        {/* Middle section: Navigation Links */}
        <NavbarContent className="basis-1/2 justify-center bg-transparent items-center hidden md:flex !justify-center">
          <ul className="flex gap-4 justify-center items-center">
            <NavbarItem>
              <NextLink href="/pricing" passHref legacyBehavior>
                <Link className={navLinkClasses} onClick={() => trackEvent("NavbarItem", { name: "Pricing", action: "press", category: "navbar" })}>
                  Pricing
                </Link>
              </NextLink>
            </NavbarItem>
            <NavbarItem>
              <NextLink href="/downloads" passHref legacyBehavior>
                <Link className={navLinkClasses} onClick={() => trackEvent("NavbarItem", { name: "Downloads", action: "press", category: "navbar" })}>
                  Downloads
                </Link>
              </NextLink>
            </NavbarItem>
            <NavbarItem>
              <NextLink href="/blog" passHref legacyBehavior>
                <Link className={navLinkClasses} onClick={() => trackEvent("NavbarItem", { name: "Blog", action: "press", category: "navbar" })}>
                  Blog
                </Link>
              </NextLink>
            </NavbarItem>
            <NavbarItem>
              <NextLink href="/teams" passHref legacyBehavior>
                <Link className={navLinkClasses} onClick={() => trackEvent("NavbarItem", { name: "Teams", action: "press", category: "navbar" })}>
                  Teams
                </Link>
              </NextLink>
            </NavbarItem>
            <NavbarItem>
              <NextLink href="/docs/faq/plans_orders" passHref legacyBehavior>
                <Link className={navLinkClasses} onClick={() => trackEvent("NavbarItem", { name: "Help", action: "press", category: "navbar" })}>
                  Help
                </Link>
              </NextLink>
            </NavbarItem>
          </ul>
        </NavbarContent>

        {/* Right section: My Account Link, Get CicadaVPN Button, and Theme Switch */}
        <NavbarContent className="basis-1/4 flex gap-4 bg-transparent items-center justify-end">
          <NavbarItem className="flex h-full items-center ml-auto hidden md:flex">
            {/* <ThemeSwitch className="flex items-center" /> */}
          </NavbarItem>

          <NavbarItem className="flex h-full items-center hidden md:flex">
            <NextLink href="/account" passHref legacyBehavior>
              <Link className={clsx(navLinkClasses, "flex items-center")} color="foreground">
                My Dashboard
              </Link>
            </NextLink>
          </NavbarItem>

          {/* Button: Hidden on small screens, visible on medium and larger */}
          <NavbarItem className="hidden md:flex h-full items-center">
            <NextLink href="/pricing" passHref legacyBehavior>
              <Button
                as={NextLink}
                className="w-full md:h-11 md:w-auto font-bold flex items-center"
                color="primary"
                endContent={
                  <FaArrowRight
                    className="group-data-[hover=true]:translate-x-0.5 outline-none transition-transform"
                    strokeWidth={2}
                  />
                }
                href="/pricing"
                radius="full"
                size="lg"
              >
                Get Started in 60s
              </Button>
            </NextLink>
          </NavbarItem>

          {/* Menu toggle: Visible on small screens, hidden on medium and larger */}
          <NavbarItem className="ml-auto w-10 h-full flex justify-end items-center md:hidden">
            <NavbarMenuToggle
              aria-label="Open menu"
              className="w-full h-full pt-1"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              icon={<FaBars />}
            />
          </NavbarItem>
        </NavbarContent>

        {/* Mobile Drawer */}
        <MobileDrawer
          isMenuOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onLogout={handleLogout}
          accountLinks={accountLinks}
          onSelect={handleSelect}
        />
      </NextUINavbar>
    </>
  );
};
