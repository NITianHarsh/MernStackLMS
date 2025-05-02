import axios from "axios";

let cachedAccessToken = null;
let tokenExpiry = null;

// Get Zoom OAuth token
const getZoomAccessToken = async () => {
  // If the token is cached and still valid, return it
  if (cachedAccessToken && tokenExpiry > Date.now()) {
    return cachedAccessToken;
  }

  try {
    // Fetch new Zoom access token
    const response = await axios.post(
      `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`,
      {},
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
          ).toString("base64")}`,
        },
      }
    );

    // Cache the token and calculate its expiration time
    cachedAccessToken = response.data.access_token;
    tokenExpiry = Date.now() + response.data.expires_in * 1000 - 60 * 1000; // Renew 1 minute early
    return cachedAccessToken;
  } catch (error) {
    console.error("Error fetching Zoom access token:", {
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });
    throw new Error("Failed to fetch Zoom OAuth token");
  }
};

// Function to create a Zoom meeting
export const createZoomMeeting = async (meetingData) => {
  try {
    const token = await getZoomAccessToken();

    // Create Zoom meeting using the OAuth token
    const response = await axios.post(
      `https://api.zoom.us/v2/users/me/meetings`,
      meetingData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    // Log the error for debugging
    console.error("Zoom API Error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw new Error(error.response?.data?.message || "Failed to create Zoom meeting");
  }
};
