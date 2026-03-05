/**
 * Extracts error message from API response
 * API returns errors in format: { success: false, data: { detail: "message" } }
 */
export const getApiErrorMessage = (error: unknown, fallback = "An error occurred"): string => {
  const err = error as {
    response?: {
      data?: {
        data?: { detail?: string };
        message?: string;
      };
    };
    message?: string;
  };

  return (
    err?.response?.data?.data?.detail || err?.response?.data?.message || err?.message || fallback
  );
};
