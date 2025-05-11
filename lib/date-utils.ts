/**
 * Format a date string in the format YYYY-MM-DD into a more readable format like "Aug 2025"
 * @param dateString The date string to format (YYYY-MM-DD or YYYY-MM)
 * @returns A formatted date string in the format "Aug 2025"
 */
export function formatDate(dateString: string): string {
  try {
    if (dateString === "present") return "Present";

    // Handle YYYY-MM-DD or YYYY-MM formats
    const date = new Date(
      dateString.includes("-") && dateString.split("-").length === 2
        ? `${dateString}-01` // Add day if only YYYY-MM is provided
        : dateString
    );

    // Format to "Aug 2025" style
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  } catch (e) {
    console.error("Date formatting error:", e, dateString);
    return dateString;
  }
}

/**
 * Format a date string in the format YYYY-MM-DD into a more detailed format like "August 15, 2025"
 * @param dateString The date string to format
 * @returns A formatted date string in the format "August 15, 2025"
 */
export function formatFullDate(dateString: string): string {
  try {
    if (dateString === "present") return "Present";

    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (e) {
    console.error("Date formatting error:", e, dateString);
    return dateString;
  }
}

/**
 * Get a relative date string like "2 days ago" or "3 months ago"
 * @param dateString The date string to format
 * @returns A relative date string
 */
export function getRelativeTimeString(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays < 1) {
      return "Today";
    } else if (diffInDays === 1) {
      return "Yesterday";
    } else if (diffInDays < 30) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30);
      return `${months} ${months === 1 ? "month" : "months"} ago`;
    } else {
      const years = Math.floor(diffInDays / 365);
      return `${years} ${years === 1 ? "year" : "years"} ago`;
    }
  } catch (e) {
    console.error("Date formatting error:", e, dateString);
    return "Invalid date";
  }
}
