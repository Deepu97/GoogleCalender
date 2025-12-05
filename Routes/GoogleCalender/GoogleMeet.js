const express=require('express');
const router=express.Router();
const {Get_token,GetEvent,CreateMeeting,RefreshToken} = require('../../Controller/Get_token');
const {GeminiAi} =require('../../Controller/Gemini');
router.post('/get-token',Get_token);
router.post('/create-meet',CreateMeeting);
router.post('/get-google-events',GetEvent);
router.get('/refresh-token',RefreshToken);


module.exports=router;