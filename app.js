const express=require('express');
import dotenv from "dotenv";
const cors=require('cors');
const app=express();
app.use(cors());
app.use(express.json());
const GoogleMeet=require('./Routes/GoogleCalender/GoogleMeet');
const GeminiRoute=require('./Routes/Gemini/GeminiRoute');
app.use('/',GoogleMeet);
app.use('/',GeminiRoute);
app.listen(process.env.Port,()=>{
    
    console.log("server listen on port 5000");
})