const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function GeminiAi(req,res) {
     
     const {transcript}=req.body;
    //  const {transcript}=req.body;


  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // ✅ Make sure model name matches the latest endpoint
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // const transcript =
    //   "Schedule a meeting titled Project Discussion on November 12th 2025 at 4 PM.";

    const prompt = `
Extract the meeting details from the given text.
Return only JSON with the following fields:
- title
- agenda (default: "Voice scheduled meeting")
- start (YYYY-MM-DD)
- end (24-hour format HH:mm)

Text: """${transcript}"""
Return JSON only.
`;

    const result = await model.generateContent(prompt);
    let text = result.response.text();
     text = text
      .replace(/```json|```/g, "")  // remove ```json or ```
      .trim();
    const ScheduleMeet=JSON.parse(text);
    res.json(ScheduleMeet);
    try {
      console.log("✅ Parsed JSON:", JSON.parse(text));
    } catch (err) {
      console.error("⚠️ Invalid JSON from Gemini:", text);
    }
  } catch (error) {
    console.error("🔥 Gemini API Error:", error);
  }
}

module.exports={GeminiAi}
