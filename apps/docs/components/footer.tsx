"use client";

import { usePathname } from "next/navigation";
import { getCurrentYear } from "@/utils/time";
import { FaChevronRight } from "react-icons/fa";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient"; // Import supabase client

export const Footer = () => {
  const pathname = usePathname();
  const pagePath = pathname
    .replace("/", "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  const [jwtSnippet, setJwtSnippet] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [jwtExpiration, setJwtExpiration] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [accountsData, setAccountsData] = useState<any[]>([]);
  const [devicesData, setDevicesData] = useState<any[]>([]);
  const [authCreatedAt, setAuthCreatedAt] = useState<string | null>(null);

  useEffect(() => {
    const getSessionAndData = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const token = data.session.access_token;
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map(function (c) {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
        );

        const parsedJwt = JSON.parse(jsonPayload);
        setJwtSnippet(token.slice(0, 16)); // First 16 chars of the JWT
        setFullName(parsedJwt.user_metadata?.full_name || null); // Get full name from JWT
        setEmail(data.session.user?.email || ""); // Get email from Supabase session
        setJwtExpiration(parsedJwt.exp); // Set the JWT expiration time

        // Calculate time remaining
        const now = Math.floor(Date.now() / 1000);
        const timeLeft = parsedJwt.exp - now;

        if (timeLeft > 0) {
          const minutes = Math.floor(timeLeft / 60);
          const seconds = timeLeft % 60;
          setTimeRemaining(`${minutes}m ${seconds}s`);
        } else {
          setTimeRemaining("Expired");
        }

        // Fetch the auth user data, including the created_at field
        const { data: user, error: authError } = await supabase.auth.getUser();

        if (authError) {
          console.error("Error fetching auth user data:", authError.message);
        } else {
          setAuthCreatedAt(user.user?.created_at);
        }

        // Fetch user data from Supabase
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("id")
          .eq("id", parsedJwt.sub)
          .single();

        if (userError) {
          console.error("Error fetching user data:", userError.message);
        } else {
          setUserData(userData);
        }

        // Fetch all account data associated with the user
        const { data: accountsData, error: accountsError } = await supabase
          .from("accounts")
          .select("id, account_number, max_devices, expiry, created_at")
          .eq("user_id", userData?.id);

        if (accountsError) {
          console.error("Error fetching account data:", accountsError.message);
        } else {
          setAccountsData(accountsData || []); // Set the accounts data

          // Extract the account numbers
          const accountNumbers = accountsData?.map(
            (account) => account.account_number
          );

          // Fetch devices associated with the user's accounts
          if (accountNumbers.length > 0) {
            const { data: devicesData, error: devicesError } = await supabase
              .from("devices")
              .select(
                "name, ipv4_address, ipv6_address, last_active, event_type, account_number"
              )
              .in("account_number", accountNumbers);

            if (devicesError) {
              console.error("Error fetching devices:", devicesError.message);
            } else {
              setDevicesData(devicesData || []); // Set the devices data
            }
          }
        }
      }
    };

    getSessionAndData();

    // Optional: Update time remaining every second
    const interval = setInterval(() => {
      if (jwtExpiration) {
        const now = Math.floor(Date.now() / 1000);
        const timeLeft = jwtExpiration - now;

        if (timeLeft > 0) {
          const minutes = Math.floor(timeLeft / 60);
          const seconds = timeLeft % 60;
          setTimeRemaining(`${minutes}m ${seconds}s`);
        } else {
          setTimeRemaining("Expired");
          clearInterval(interval); // Stop updating after expiration
        }
      }
    }, 1000);

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [jwtExpiration]);

  if (pathname.includes("/examples")) {
    return null;
  }

  return (
    <footer className="w-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 border-t border-gray-200 dark:border-gray-700">
      {/* Centered Container */}
      <div className="mx-auto max-w-3xl px-6">
        {/* Top Bar with Logo and Breadcrumb */}
        <div className="flex items-center py-2">
          {/* SVG Icon - Light/Dark Mode Compatible */}
          <img
            src="/images/Group191.svg"
            alt="Logo"
            className="w-6 h-6 dark:hidden" // For light mode
          />
          <img
            src="/images/Group178.svg"
            alt="Logo"
            className="w-6 h-6 hidden dark:block" // For dark mode
          />
          <FaChevronRight className="text-xs mx-2 text-gray-600 dark:text-gray-400" />
          <Link href={pathname}>
            <span className="text-gray-600 dark:text-gray-400">{pagePath}</span>
          </Link>
        </div>

        {/* New Divider Bar Below the Icon/Path */}
        <div className="w-full border-t border-gray-200 dark:border-gray-700 my-4"></div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3">
              Shop and Learn
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="hover:text-primary-600 dark:hover:text-primary-400"
                >
                  CicadaVPN
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Unblock everything!
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Cicada Features
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Cicada Security
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Cicada Family Friendly
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3">
              Account & Support
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Manage Your ID
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Account Settings
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Devices
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Setup Guides
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3">
              Programs & Business
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Affiliate
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-600 dark:hover:text-primary-400"
                >
                  YouTube Creators
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Student Discount
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Graduate Discount
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Business Solutions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Partnerships
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3">
              Legal & Policies
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/privacy"
                  className="hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/docs/policies/general_terms"
                  className="hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Warranty
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Sales and Refunds
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Site Map
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* More Ways to Shop */}
        <div className="border-t border-gray-200 dark:border-gray-700 mt-12 pt-4 text-sm text-gray-600 dark:text-gray-400">
          <p>
            More ways to shop:{" "}
            <a
              href="#"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              Find a CicadaVPN Store
            </a>{" "}
            or{" "}
            <a
              href="#"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              other retailer
            </a>{" "}
            near you.
          </p>
        </div>

        {/* Legal and Policy Links */}
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 flex flex-col lg:flex-row items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {getCurrentYear()} CicadaVPN. All rights reserved.
          </p>
          <div className="flex gap-4 pt-4 lg:pt-0 text-sm text-gray-600 dark:text-gray-400">
            <a href="/privacy" className="hover:underline">
              Privacy Policy
            </a>
            <a href="/docs/policies/general_terms" className="hover:underline">
              Terms of Use
            </a>
            <a href="#" className="hover:underline">
              Sales and Refunds
            </a>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">United States</p>
        </div>

        {/* Trademark Acknowledgments */}
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
            WireGuard® is a registered trademark of Jason A. Donenfeld.<br />
            Apple®, iOS®, and macOS® are trademarks of Apple Inc., registered in the U.S. and other countries.<br />
            Android™ and Google Play™ are trademarks of Google LLC.<br />
            Windows® is a registered trademark of Microsoft Corporation.<br />
            Linux® is a registered trademark of Linus Torvalds.<br />
            Firefox® is a registered trademark of the Mozilla Foundation.<br />
            Visa® is a registered trademark of Visa International Service Association.<br />
            Mastercard® is a registered trademark of Mastercard International.<br />
            PayPal® is a registered trademark of PayPal, Inc.
          </div>

        {/* JWT Snippet, Full Name, Email, User Data, Account Data, and Device Data */}
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-8 text-center">
          {jwtSnippet ? (
            <>
            <h3 className="font-bold mt-4">JWT information</h3>
              <p>JWT Snippet: {jwtSnippet}</p>
              {fullName && <p>Full Name: {fullName}</p>}
              {email && <p>Email: {email}</p>}
              {authCreatedAt && <p>User Created At: {authCreatedAt}</p>}
              {jwtExpiration && (
                <>
                  <p>JWT Expires At: {new Date(jwtExpiration * 1000).toLocaleString()}</p>
                  <p>Time Remaining: {timeRemaining}</p>
                </>
              )}
              {userData && (
                <>
                  <p>User ID: {userData.id}</p>
                </>
              )}
              {accountsData.length > 0 ? (
                <>
                  <h3 className="font-bold mt-4">Accounts</h3>
                  {accountsData.map((account) => (
                    <div key={account.id}>
                      <p>Account ID: {account.id}</p>
                      <p>Account Number: {account.account_number}</p>
                      <p>Max Devices: {account.max_devices}</p>
                      <p>Expiry: {account.expiry}</p>
                      <p>Created At: {account.created_at}</p>
                    </div>
                  ))}
                </>
              ) : (
                <p>No accounts associated with this user.</p>
              )}
              {devicesData.length > 0 ? (
                <>
                  <h3 className="font-bold mt-4">Devices</h3>
                  {devicesData.map((device) => (
                    <div key={device.name}>
                      <p>Device Name: {device.name}</p>
                      <p>IPv4 Address: {device.ipv4_address}</p>
                      <p>IPv6 Address: {device.ipv6_address}</p>
                      <p>Last Active: {device.last_active}</p>
                    </div>
                  ))}
                </>
              ) : (
                <p>No devices associated with this user.</p>
              )}
            </>
          ) : (
            <p>No JWT present</p>
          )}
        </div>
      </div>
    </footer>
  );
};
