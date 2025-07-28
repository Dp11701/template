// Environment variables that are safe to use on both server and client
export const getApiUrl = () => {
  if (typeof window === "undefined") {
    // Server-side: use environment variable
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  } else {
    // Client-side: use environment variable
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  }
};
