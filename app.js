const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const GoogleMeet = require("./Routes/GoogleCalender/GoogleMeet");
const GeminiRoute = require("./Routes/Gemini/GeminiRoute");

const app = express();
app.use(cors({ origin: "*", methods: ["GET", "POST", "OPTIONS"] }));
app.use(express.json());

app.use("/", GoogleMeet);
app.use("/", GeminiRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
