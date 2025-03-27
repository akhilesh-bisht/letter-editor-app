import { useEffect, useState } from "react";
import { gapi } from "gapi-script";

const CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID";
const API_KEY = "YOUR_GOOGLE_API_KEY";
const SCOPES = "https://www.googleapis.com/auth/drive.file";

export default function GoogleDriveAPI({ authToken }) {
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const loadGapi = () => {
      gapi.load("client:auth2", async () => {
        await gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          scope: SCOPES,
          discoveryDocs: [
            "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
          ],
        });

        gapi.auth.setToken({ access_token: authToken }); // Use Firebase token
        setIsAuthorized(true);
      });
    };

    if (authToken) loadGapi();
  }, [authToken]);

  return (
    <div>
      {isAuthorized ? (
        <p className="text-green-500">Connected to Google Drive ✅</p>
      ) : (
        <p className="text-red-500">Not Connected to Google Drive ❌</p>
      )}
    </div>
  );
}
