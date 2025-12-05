const axios=require('axios');

const {google}=require('googleapis')
let savedRefreshToken = null;
const Get_token=async (req,res)=>{
    try {
    const { code } = req.body;

    const data = new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: "https://incubate.nxtclouds.com",
      grant_type: "authorization_code",
    });

    const tokenRes = await axios.post("https://oauth2.googleapis.com/token", data);
    res.json(tokenRes.data); // includes refresh_token (first time only)
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
//create metting 
const CreateMeeting = async (req, res) => {
  try {
    console.log(req.body);

    const { accessToken, Meet } = req.body;
    const eventsData = Meet;

    console.log("📩 Received Event:", eventsData);

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      "https://incubate.nxtclouds.com"   // no ending slash
    );

    oauth2Client.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    // ⭐ FIXED — Use direct ISO timestamp
    const startTime = new Date(eventsData.start);
    const endTime = new Date(eventsData.end);

    if (isNaN(startTime) || isNaN(endTime)) {
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
};

// get google Events
const GetEvent=async(req,res)=>{
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

}
const RefreshToken=async(req,res)=>{
  try {
    const { refresh_token } = req.body;

    const data = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token,
      grant_type: "refresh_token",
    });

    const tokenRes = await axios.post("https://oauth2.googleapis.com/token", data);
    res.json(tokenRes.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

}
module.exports={Get_token,GetEvent,CreateMeeting,RefreshToken}