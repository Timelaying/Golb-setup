import { getApiBaseUrl } from "@/app/utils/apiBaseUrl";

// Profile pictures are stored either as a full https URL (Vercel Blob) or as a
// path on the API server (local disk). Return a URL the browser can load.
export function pictureUrl(value) {
  if (!value) return "/default-avatar.png";
  if (/^https?:\/\//.test(value)) return value;
  return `${getApiBaseUrl()}${value}`;
}
