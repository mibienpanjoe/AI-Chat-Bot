import { GoogleGenerativeAI } from "@google/generative-ai";

// Fetch API key from environment variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

async function run(prompt) {
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

export default run;
