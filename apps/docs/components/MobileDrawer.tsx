import React, { FC, useState, useEffect } from "react";
import { FaUserCircle, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { NavbarItem, Link } from "@nextui-org/react";
import NextLink from "next/link";
import { ThemeSwitch } from "@/components";
import { supabase } from "@/utils/supabaseClient";
import manifest from "@/config/routes.json"; // Import the routes.json

interface MobileDrawerProps {
  isMenuOpen: boolean;
  onClose: () => void;
  accountLinks: { href: string; label: string; icon: React.ReactNode }[];
  onSelect: (section: string) => void;
  onLogout: () => void;
}

export const MobileDrawer: FC<MobileDrawerProps> = ({
  isMenuOpen,
  onClose,
  accountLinks,
  onSelect,
  onLogout,
}) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // State to control opening of docs sections - all collapsed by default
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const session = await supabase.auth.getSession();
        if (session.error || !session.data.session) {
          setIsLoggedIn(false);
          return;
        }

        setIsLoggedIn(true);
        const userId = session.data.session.user.id;

        const { data: user, error: userError } = await supabase
          .from("users")
          .select("full_name, avatar_url")
          .eq("id", userId)
          .single();

        if (userError) {
          console.error("Error fetching user profile:", userError.message);
          return;
        }

        if (user) {
          setFullName(user.full_name);
          setAvatarUrl(user.avatar_url || null);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };

    fetchUserProfile();
  }, []);

  // Toggle the expansion of a section
  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Render routes from routes.json, dropping the ".mdx" from paths
  const renderRoutes = () => {
    return manifest.routes.map((section) => {
      const isOpen = openSections[section.key] ?? false; // Default to collapsed

      return (
        <div key={section.key}>
          <button
            className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-900"
            onClick={() => toggleSection(section.key)}
          >
            <span>{section.title}</span>
            {isOpen ? <FaChevronUp className="w-4 h-4" /> : <FaChevronDown className="w-4 h-4" />}
          </button>

          {isOpen && (
            <div className="mt-2 ml-4">
              {section.routes.map((route) => (
                <NavbarItem key={route.key}>
                  <NextLink href={route.path.replace('.mdx', '')} passHref legacyBehavior>
                    <Link className="text-sm font-medium text-gray-900" onClick={onClose}>
                      {route.title}
                    </Link>
                  </NextLink>
                </NavbarItem>
              ))}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div
      className={`fixed inset-0 z-[100000] transition-opacity ${
        isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.4)",
      }}
    >
      <div
        className={`fixed top-0 right-0 h-full w-4/5 bg-white z-[100001] transform transition-transform ease-in-out duration-300 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
        style={{
          borderTopLeftRadius: "20px",
          borderBottomLeftRadius: "20px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-300 bg-gray-200 dark:bg-gray-300 rounded-tl-lg">
          <ThemeSwitch />
          <FaTimes className="text-gray-900 dark:text-gray-500 w-6 h-6 cursor-pointer" onClick={onClose} />
        </div>

        <div className="flex flex-col justify-between h-full">
          <div className="p-4 bg-white flex flex-col flex-grow border-b border-gray-300">
            <div className="flex items-center mb-4">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full"
                  onError={(e) => {
                    e.currentTarget.src = "/default-avatar.png";
                  }}
                />
              ) : (
                <FaUserCircle className="w-10 h-10 text-gray-600" />
              )}
              <div className="ml-3">
                {fullName ? (
                  <>
                    <p className="text-xs text-gray-500">LOGGED IN AS</p>
                    <p className="text-sm font-medium text-gray-900">{fullName}</p>
                  </>
                ) : (
                  <NextLink href="/auth" passHref legacyBehavior>
                    <Link className="text-sm font-medium text-gray-900">
                      LOG-IN FOR MORE
                    </Link>
                  </NextLink>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-4">
              <NavbarItem>
                <NextLink href="/account" passHref legacyBehavior>
                  <Link className="text-sm font-medium text-gray-900" onClick={onClose}>
                    My Account
                  </Link>
                </NextLink>
              </NavbarItem>

              <NavbarItem>
                <NextLink href="/pricing" passHref legacyBehavior>
                  <Link className="text-sm font-medium text-gray-900" onClick={onClose}>
                    Pricing
                  </Link>
                </NextLink>
              </NavbarItem>

              <NavbarItem>
                <NextLink href="/downloads" passHref legacyBehavior>
                  <Link className="text-sm font-medium text-gray-900" onClick={onClose}>
                    Downloads
                  </Link>
                </NextLink>
              </NavbarItem>

              <NavbarItem>
                <NextLink href="/blog" passHref legacyBehavior>
                  <Link className="text-sm font-medium text-gray-900" onClick={onClose}>
                    Blog
                  </Link>
                </NextLink>
              </NavbarItem>

              <NavbarItem>
                <NextLink href="/teams" passHref legacyBehavior>
                  <Link className="text-sm font-medium text-gray-900" onClick={onClose}>
                    Teams
                  </Link>
                </NextLink>
              </NavbarItem>

              {isLoggedIn && (
                <NavbarItem>
                  <Link
                    className="text-sm font-medium text-red-600 cursor-pointer"
                    onClick={onLogout}
                  >
                    Logout
                  </Link>
                </NavbarItem>
              )}
            </div>

            {/* Separator for Docs Section */}
            <div className="border-t border-gray-300 my-4"></div>

            {/* Render Docs Routes from routes.json */}
            {renderRoutes()}
          </div>

          <div className="p-8 bg-gray-100 rounded-bl-lg flex justify-between items-center">
            <NextLink href="/privacy" passHref legacyBehavior>
              <Link className="text-xs text-gray-600">Privacy Policy</Link>
            </NextLink>
            <NextLink href="/terms" passHref legacyBehavior>
              <Link className="text-xs text-gray-600">Terms of Service</Link>
            </NextLink>
          </div>
        </div>
      </div>
    </div>
  );
};