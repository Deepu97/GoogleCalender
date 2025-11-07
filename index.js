import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import { google } from "googleapis";

dotenv.config();
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://incubate.nxtclouds.com/"
    ],
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
  })
);
app.post("/get-token", async (req, res) => {
  try {
    const { code } = req.body;
   console.log(code);
    const data = new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: "https://incubate.nxtclouds.com/",
      grant_type: "authorization_code",
    });
    // console.log(tokenRes);

    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      data.toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
      console.log(tokenRes.data);
    res.json(tokenRes.data);
  } catch (err) {
    console.log("Token Exchange Error:", err.response?.data || err.message);
    res.status(400).json({ error: err.response?.data || err.message });
  }
});

app.post("/create-meet", async (req, res) => {
  try {
    const { accessToken, events } = req.body;
    const eventsData = events[0];
    console.log("📩 Received Event:", eventsData);

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      "https://incubate.nxtclouds.com/"
    );

    oauth2Client.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const startTime = new Date(eventsData.start);
    const endTime = new Date(eventsData.end);

    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      return res.status(400).json({ error: "Invalid time value received" });
    }

    const event = {
      summary: eventsData.title,
      description: eventsData.agenda,
      start: {
        dateTime: startTime.toISOString(),
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: "Asia/Kolkata",
      },
      conferenceData: {
        createRequest: {
          requestId: "req-" + Date.now(),
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      conferenceDataVersion: 1,
      resource: event,
    });

    const meetLink = response.data.conferenceData?.entryPoints?.[0]?.uri || null;

    res.json({ meetLink });

  } catch (err) {
    console.error("❌ Google Meet Error:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});
////get events of calander
app.post("/get-google-events", async (req, res) => {
  const { accessToken } = req.body;

  try {
    const calendarRes = await axios.get(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    res.json({ events: calendarRes.data.items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch Google events" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("✅ Backend running on 5000"));
