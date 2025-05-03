// routes/zoom.js
import { Router } from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const router = Router();

// Get access token
async function getZoomAccessToken() {
  const tokenResponse = await axios.post(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`,
    {},
    {
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
          ).toString("base64"),
      },
    }
  );

  return tokenResponse.data.access_token;
}

// Create meeting
router.post("/create-meeting", async (req, res) => {
  const { date, time, note } = req.body;
  try {
    const accessToken = await getZoomAccessToken();
    const dateTimeISO = new Date(`${date}T${time}`).toISOString();

    const meetingResponse = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",
      {
        topic: note || "Scheduled Meeting",
        type: 2,
        start_time: dateTimeISO,
        duration: 60,
        timezone: "UTC",
        settings: {
          join_before_host: false,
          approval_type: 1,
          registration_type: 1,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const { join_url, start_url } = meetingResponse.data;
    console.log("Zoom Join URL:", join_url);
    console.log("Zoom Start URL:", start_url)

    const url = new URL(join_url);
    const meetingId = url.pathname.split("/").pop(); // gets the last part of /j/MEETING_ID
    const password = url.searchParams.get("pwd");

    const zoom_deep_link = `zoommtg://zoom.us/join?action=join&confno=${meetingId}&pwd=${password}`;

    res.json({ join_url, start_url, zoom_deep_link });
  } catch (err) {
    console.error("Zoom API Error", err.response?.data || err.message);
    res.status(500).send("Error creating Zoom meeting");
  }
});

export default router;
