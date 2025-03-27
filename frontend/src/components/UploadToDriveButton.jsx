import { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "./ui/Button"; // Adjust path if needed
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, googleProvider } from "./firebase"; // Import Firebase
import { gapi } from "gapi-script";

// 🔥 Google API Config
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const SCOPES = "https://www.googleapis.com/auth/drive.file";

export default function UploadToDriveButton({ content, title }) {
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    try {
      gapi.load("client", async () => {
        await gapi.client.init({
          apiKey: API_KEY,
          discoveryDocs: [
            "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
          ],
        });
      });
    } catch (error) {
      console.error("Google API Initialization Error:", error);
    }
  }, []);

  // ✅ Sign In with Google & Get OAuth Token
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      // ✅ Get Google OAuth Access Token (not Firebase token)
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const googleAccessToken = credential.accessToken;

      if (!googleAccessToken) {
        throw new Error("Failed to get Google OAuth token.");
      }

      return googleAccessToken;
    } catch (error) {
      console.error("Firebase Auth Error:", error);
      alert("Google sign-in failed. Try again.");
      return null;
    }
  };

  // 📌 Upload to Google Drive
  const uploadToDrive = async () => {
    if (!content.trim()) {
      alert("❌ Cannot upload an empty document!");
      return;
    }

    setIsUploading(true);

    try {
      // ✅ Get Google OAuth Token
      const token = await signInWithGoogle();
      if (!token) return;

      const metadata = {
        name: `${title || "Untitled Document"}.html`,
        mimeType: "application/vnd.google-apps.document",
      };

      const boundary = "foo_bar_baz";
      const delimiter = `\r\n--${boundary}\r\n`;
      const closeDelimiter = `\r\n--${boundary}--`;

      const multipartRequestBody =
        `${delimiter}Content-Type: application/json\r\n\r\n` +
        JSON.stringify(metadata) +
        `${delimiter}Content-Type: text/html\r\n\r\n` +
        content +
        closeDelimiter;

      // ✅ Use Google OAuth Token for Authentication
      const response = await fetch(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": `multipart/related; boundary=${boundary}`,
          },
          body: multipartRequestBody,
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert(`✅ Document uploaded successfully: ${data.name}`);
      } else {
        console.error("Upload Error:", data);
        alert(`❌ Upload failed: ${data.error?.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Upload Error:", error);
      alert("❌ An error occurred while uploading.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Button onClick={uploadToDrive} variant="primary" disabled={isUploading}>
      {isUploading ? (
        "Uploading..."
      ) : (
        <>
          <Upload className="h-4 w-4" /> Upload to Drive
        </>
      )}
    </Button>
  );
}
