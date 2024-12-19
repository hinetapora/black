"use client";

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@nextui-org/react";
import React, { useState, useEffect } from "react";
import { BottomIcon } from "../icons/sidebar/bottom-icon";
import { supabase } from "@/utils/supabaseClient"; // Ensure this path is correct

// Define the Agency interface based on your schema
interface Agency {
  id: string;
  logo_svg: string; // Assuming logo is stored as an SVG string
}

export const CompaniesDropdown = () => {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Function to decode JWT and extract UUID (similar to your footer)
  const getUserUUIDFromJWT = (token: string): string | null => {
    try {
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
      return parsedJwt.sub || null; // 'sub' contains the UUID
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchAgencies = async () => {
      setLoading(true);
      try {
        // Step 1: Get the current session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();
        if (session && session.access_token) {
          const userUUID = getUserUUIDFromJWT(session.access_token);
          if (!userUUID) {
            console.error("User UUID not found in JWT.");
            setLoading(false);
            return;
          }

          // Step 2: Fetch agency_team_members to get agency_ids
          const { data: teamMembers, error: teamError } = await supabase
            .from("agency_team_members")
            .select("agency_id")
            .eq("user_id", userUUID);

          if (teamError) {
            console.error("Error fetching team members:", teamError.message);
            setLoading(false);
            return;
          }

          const agencyIds = teamMembers.map((member) => member.agency_id);

          if (agencyIds.length === 0) {
            console.warn("No agencies associated with this user.");
            setLoading(false);
            return;
          }

          // Step 3: Fetch agencies based on the agencyIds
          const { data: agenciesData, error: agenciesError } = await supabase
            .from("agencies")
            .select("id, logo_square")
            .in("id", agencyIds);

          if (agenciesError) {
            console.error("Error fetching agencies:", agenciesError.message);
            setLoading(false);
            return;
          }

          // Step 4: Map the fetched data to the Agency interface
          const fetchedAgencies: Agency[] = agenciesData.map((agency: any) => ({
            id: agency.id,
            logo_svg: agency.logo_square, // SVG string
          }));

          setAgencies(fetchedAgencies);

          // Set the first agency as the default selected agency
          if (fetchedAgencies.length > 0) {
            setSelectedAgency(fetchedAgencies[0]);
          }
        } else {
          console.error("No active session found.");
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgencies();
  }, []);

  // Handler for when an agency is selected from the dropdown
  const handleAction = (key: string | number) => {
    const agency = agencies.find((agency) => agency.id === key);
    if (agency) {
      setSelectedAgency(agency);
      // Optionally, implement additional logic such as updating user context or application state
    }
  };

  return (
    <Dropdown
      classNames={{
        base: "w-full min-w-[260px]",
      }}
      isDisabled={loading || agencies.length === 0}
    >
      <DropdownTrigger className="cursor-pointer">
        <div className="flex items-center gap-2">
          {selectedAgency?.logo_svg ? (
            <div
              className="w-6 h-6"
              dangerouslySetInnerHTML={{ __html: selectedAgency.logo_svg }}
            />
          ) : (
            <div className="w-6 h-6 bg-gray-300 rounded-full" /> // Placeholder if no logo
          )}
          <BottomIcon />
        </div>
      </DropdownTrigger>
      <DropdownMenu onAction={handleAction} aria-label="Agency Actions">
        <DropdownSection title="Agencies">
          {agencies.map((agency) => (
            <DropdownItem
              key={agency.id}
              startContent={
                <div
                  className="w-6 h-6"
                  dangerouslySetInnerHTML={{ __html: agency.logo_svg }}
                />
              }
              classNames={{
                base: "py-4",
              }}
              value={agency.id} // Set the value to identify which agency was selected
            >
              {/* Since we're removing name and location, the child can be empty or contain a visual indicator */}
              {/* Optionally, you can add tooltips or accessible labels */}
            </DropdownItem>
          ))}
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
};
