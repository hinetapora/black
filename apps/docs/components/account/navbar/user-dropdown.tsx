import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  NavbarItem,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { DarkModeSwitch } from "./darkmodeswitch";
import { supabase } from "@/utils/supabaseClient";

export const UserDropdown = () => {
  const [fullName, setFullName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const token = data.session.access_token;
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
            .join("")
        );
        const parsedJwt = JSON.parse(jsonPayload);

        setFullName(parsedJwt.user_metadata?.full_name || "N/A");
        setEmail(data.session.user?.email || "N/A");

        // Fetch additional user profile information
        const { data: user, error } = await supabase
          .from("users")
          .select("avatar_url")
          .eq("id", parsedJwt.sub)
          .single();

        if (error) {
          console.error("Error fetching user avatar:", error.message);
        } else {
          setAvatarUrl(user?.avatar_url || null);
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <Dropdown>
      <NavbarItem>
        <DropdownTrigger>
          <Avatar
            as="button"
            color="secondary"
            size="md"
            src={avatarUrl || "https://i.pravatar.cc/150?u=a042581f4e29026704d"}
          />
        </DropdownTrigger>
      </NavbarItem>
      <DropdownMenu
        aria-label="User menu actions"
        onAction={(actionKey) => console.log({ actionKey })}
      >
        <DropdownItem
          key="profile"
          className="flex flex-col justify-start w-full items-start"
        >
          <p>Signed in as</p>
          <p className="font-semibold">{fullName}</p> {/* Display full name */}
          <p>{email}</p> {/* Display email */}
        </DropdownItem>
        <DropdownItem key="settings">My Settings</DropdownItem>
        <DropdownItem key="team_settings">Team Settings</DropdownItem>
        <DropdownItem key="analytics">Analytics</DropdownItem>
        <DropdownItem key="system">System</DropdownItem>
        <DropdownItem key="configurations">Configurations</DropdownItem>
        <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
        <DropdownItem key="switch">
          <DarkModeSwitch />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
