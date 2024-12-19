"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { supabase } from "@/utils/supabaseClient"; // Ensure the correct path
import { getUserUUIDFromJWT } from "@/utils/auth"; // Import the utility function
import { Spinner } from "@nextui-org/react"; // Optional: Spinner for loading state

interface Agency {
  id: string;
  full_name: string;
  email: string;
  logo_square: string; // SVG string
  iban: string;
}

export const Content = () => {
  const [agency, setAgency] = useState<Agency | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [formState, setFormState] = useState({
    full_name: "",
    email: "",
    iban: "",
    logo_square: "",
  });
  const [uploading, setUploading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgencyData = async () => {
      setLoading(true);
      try {
        // Step 1: Get the current session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (session && session.access_token) {
          // Step 2: Decode JWT to get the user's UUID
          const userUUID = getUserUUIDFromJWT(session.access_token);

          if (!userUUID) {
            setErrorMessage("Failed to retrieve user information.");
            setLoading(false);
            return;
          }

          // Log the UUID for debugging purposes
          console.log("User UUID:", userUUID); // <-- Logging the UUID

          // Step 3: Fetch agency_team_members to get agency_ids
          const { data: teamMembers, error: teamError } = await supabase
            .from("agency_team_members")
            .select("agency_id")
            .eq("user_id", userUUID);

          if (teamError) {
            console.error("Error fetching team members:", teamError.message);
            setErrorMessage("Failed to fetch agency associations.");
            setLoading(false);
            return;
          }

          const agencyIds = teamMembers.map((member) => member.agency_id);

          if (agencyIds.length === 0) {
            setErrorMessage("No agencies associated with this user.");
            setLoading(false);
            return;
          }

          // Step 4: Fetch agencies based on the agencyIds
          const { data: agenciesData, error: agenciesError } = await supabase
            .from("agencies")
            .select("id, full_name, email, logo_square, iban")
            .in("id", agencyIds);

          if (agenciesError) {
            console.error("Error fetching agencies:", agenciesError.message);
            setErrorMessage("Failed to fetch agency data.");
            setLoading(false);
            return;
          }

          if (agenciesData.length === 0) {
            setErrorMessage("No agency data found.");
            setLoading(false);
            return;
          }

          // Assuming the user is associated with only one agency
          const currentAgency = agenciesData[0];
          setAgency(currentAgency);

          // Initialize form state with current agency data
          setFormState({
            full_name: currentAgency.full_name,
            email: currentAgency.email,
            iban: currentAgency.iban,
            logo_square: currentAgency.logo_square,
          });
        } else {
          setErrorMessage("No active session found.");
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        setErrorMessage("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchAgencyData();
  }, []);

  // Handle form input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle logo upload
  const handleLogoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];

    // Validate file type (accepting SVG only)
    if (file.type !== "image/svg+xml") {
      setErrorMessage("Only SVG files are allowed for logos.");
      return;
    }

    try {
      setUploading(true);
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = async () => {
        const svgContent = reader.result as string;
        setFormState((prev) => ({
          ...prev,
          logo_square: svgContent,
        }));
        setSuccessMessage("Logo uploaded successfully.");
      };
      reader.onerror = () => {
        console.error("Error reading the SVG file.");
        setErrorMessage("Failed to read the SVG file.");
      };
    } catch (error) {
      console.error("Error uploading logo:", error);
      setErrorMessage("Failed to upload the logo.");
    } finally {
      setUploading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!agency) {
      setErrorMessage("Agency data is not loaded.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("agencies")
        .update({
          full_name: formState.full_name,
          email: formState.email,
          iban: formState.iban,
          logo_square: formState.logo_square,
        })
        .eq("id", agency.id);

      if (error) {
        console.error("Error updating agency:", error.message);
        setErrorMessage("Failed to update agency settings.");
      } else {
        setSuccessMessage("Settings updated successfully.");
        // Optionally, update the agency state
        setAgency((prev) =>
          prev
            ? {
                ...prev,
                full_name: formState.full_name,
                email: formState.email,
                iban: formState.iban,
                logo_square: formState.logo_square,
              }
            : prev
        );
      }
    } catch (error) {
      console.error("Unexpected error during update:", error);
      setErrorMessage("An unexpected error occurred during update.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
        <span className="ml-2">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">Settings</h2>

      {/* Display Success Message */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      {/* Display Error Message */}
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Name */}
        <div>
          <label
            htmlFor="full_name"
            className="block text-sm font-medium text-gray-700"
          >
            Company Name
          </label>
          <input
            type="text"
            name="full_name"
            id="full_name"
            value={formState.full_name}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Company Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formState.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* IBAN */}
        <div>
          <label
            htmlFor="iban"
            className="block text-sm font-medium text-gray-700"
          >
            IBAN
          </label>
          <input
            type="text"
            name="iban"
            id="iban"
            value={formState.iban}
            onChange={handleChange}
            required
            pattern="[A-Z]{2}\d{2}[A-Z0-9]{1,30}"
            title="Please enter a valid IBAN."
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* Logo Upload */}
        <div>
          <label
            htmlFor="logo_square"
            className="block text-sm font-medium text-gray-700"
          >
            Company Logo (SVG Only)
          </label>
          <input
            type="file"
            name="logo_square"
            id="logo_square"
            accept=".svg"
            onChange={handleLogoUpload}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-primary-50 file:text-primary-700
              hover:file:bg-primary-100
            "
          />
          {uploading && (
            <p className="text-sm text-gray-500 mt-2">Uploading logo...</p>
          )}
          {formState.logo_square && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700">Preview:</p>
              <div
                className="w-24 h-24 border border-gray-300 rounded mt-2"
                dangerouslySetInnerHTML={{ __html: formState.logo_square }}
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};
