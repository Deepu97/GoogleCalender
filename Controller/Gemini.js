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
Extract meeting details from the given text.

Return ONLY valid JSON in this exact format:
{
  "title": "string",
  "agenda": "string",
  "start": "YYYY-MM-DDTHH:mm",
  "end": "YYYY-MM-DDTHH:mm"
}

Rules:
- "agenda" default: "Voice scheduled meeting"
- "start" must be ISO format: YYYY-MM-DDTHH:mm
- "end" must be ISO format: YYYY-MM-DDTHH:mm
- Time must be 24-hour format.
- Do NOT include AM/PM.

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
