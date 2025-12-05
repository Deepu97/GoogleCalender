import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

import GoogleMeet from "./Routes/GoogleCalender/GoogleMeet.js";
import GeminiRoute from "./Routes/Gemini/GeminiRoute.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", GoogleMeet);
app.use("/", GeminiRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
