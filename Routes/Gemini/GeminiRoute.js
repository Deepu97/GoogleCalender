const express=require('express');
const GeminiRoute=express.Router();
const {GeminiAi} = require('../../Controller/Gemini');
GeminiRoute.post('/voiceGemini',GeminiAi);
module.exports=GeminiAi;