// File: app/signup/utils/validation.ts

/**
 * Validates the brand name.
 * @param name - The brand name input.
 * @returns An error message if invalid, otherwise an empty string.
 */
export const validateBrandName = (name: string): string => {
    if (name.length > 13) {
      return "Brand name must be 13 characters or fewer.";
    }
    return "";
  };
  
  /**
   * Validates social handles.
   * @param handle - The social handle input.
   * @param platform - The social platform (e.g., "twitter").
   * @returns An error message if invalid, otherwise an empty string.
   */
  export const validateSocialHandle = (handle: string, platform: string): string => {
    if (!handle.startsWith("@")) {
      return "Handle must start with '@'.";
    }
  
    const actualHandle = handle.slice(1); // Strip the '@' for further validation
  
    // Define regex patterns for different platforms
    const patterns: Record<string, RegExp> = {
      instagram: /^([A-Za-z0-9_.]{1,30})$/,
      tiktok: /^([A-Za-z0-9_.]{2,24})$/,
      twitter: /^([A-Za-z0-9_]{1,15})$/,
    };
  
    const regex = patterns[platform.toLowerCase()];
    if (!regex) {
      return "Invalid social platform.";
    }
  
    if (!regex.test(actualHandle)) {
      return `Invalid ${platform} handle format.`;
    }
  
    return "";
  };

  