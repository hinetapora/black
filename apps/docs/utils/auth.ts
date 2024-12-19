// utils/auth.ts

/**
 * Decodes a JWT and extracts the 'sub' claim which typically contains the user's UUID.
 * @param token - The JWT string.
 * @returns The user UUID if present, otherwise null.
 */
export const getUserUUIDFromJWT = (token: string): string | null => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
  
      const parsedJwt = JSON.parse(jsonPayload);
      return parsedJwt.sub || null; // 'sub' typically contains the UUID
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  };
  