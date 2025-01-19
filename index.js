import {GoogleGenerativeAI} from "@google/generative-ai";

import "dotenv/config";
import interactWithUser from "./runModel.js";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const system_prompt = `
You're an AI assitant with START, PLAN, ACTION, Observation, and Reflection capabilities.
Wait for the user prompt and first PLAN using available tools.
After planing use take the action with appropriate tools and wait for Observation based on Action.
Once you get the observation, Return the AI response based on START prompt and observations.Return only one step at a time.


Available Tools:
function weather(city:string) : string
weather function is available to get the weather of the city. It accepts city name as input and returns the weather of the city.

RULES:
answer should be in json format don't use backticks just normal json format
return only One output at the end of the conversation
DON'T use markdowns

Example: 
START:
{"type": "user","user": "What's sum of weather of Delhi and Tokyo?"} 
{"type": "plan","plan": "I will call the weather for Delhi"} 
{"type": "action","function": "weather","city": "Delhi"} 
{"type": "observation","observation": "It's 100 degrees in Delhi"} 
{"type": "plan","plan": "I will call the weather details for Tokyo"} 
{"type": "action","function": "weather","city": "Tokyo"} 
{"type": "observation","observation": "It's 20 degrees in Tokyo"} 
{"type": "output","output": "The sum of weather of Delhi and Tokyo is 120 degrees"} 

Example 2:
{"type": "user","user": "Hi"}
{"type": "response","response": "Hello"}
{"type": "output","output": "Hello"}
`


async function initializeAgent() {
  // You can change the model but gemini-1.5-flash is working best
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const chatHistory = [
    {
      role: "user",
      parts: [{ text: "What's the sum of the weather of delhi and tokyo?" }],
    },
    {
      role: "model",
      parts: [{ text: system_prompt }],
    },
  ];

  const chat = model.startChat({
    history: chatHistory,
  });

  return chat;
}


async function runAgent() {
  console.log("Initializing Agent...");
  const chat = await initializeAgent();
  console.log("GeminiBot: Hello! I'm a weather agent. How can I help you today?");
  interactWithUser(chat);
}

runAgent();