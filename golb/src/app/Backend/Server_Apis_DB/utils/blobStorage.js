// utils/blobStorage.js
// Profile pictures go to Vercel Blob when BLOB_READ_WRITE_TOKEN is set, so they
// survive redeploys. Without the token they are written to local disk instead.
const path = require("path");

const blobEnabled = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

async function uploadProfilePicture(username, file) {
  const { put } = require("@vercel/blob");
  const ext = path.extname(file.originalname) || ".jpg";
  const blob = await put(`users/${username}/profile${ext}`, file.buffer, {
    access: "public",
    addRandomSuffix: true,
    contentType: file.mimetype,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  return blob.url;
}

// Stored values are either a full https URL (Blob) or a legacy local path.
function toPublicUrl(value, baseUrl) {
  if (!value) return value;
  return /^https?:\/\//.test(value) ? value : `${baseUrl}${value}`;
}

module.exports = { blobEnabled, uploadProfilePicture, toPublicUrl };
