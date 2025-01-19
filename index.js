import {GoogleGenerativeAI} from "@google/generative-ai";
import readline from "readline";
import { weather } from "./weatherFunc.js";
import "dotenv/config";

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

const tools = {
    "weather": weather
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function initializeAgent() {
  // Use the Gemini Pro model
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

async function interactWithUser(chat) {
    while (true) {
      const userMessage = await new Promise((resolve) => {
        rl.question('You: ', resolve);
      });
  
      if (userMessage.toLowerCase() === 'exit') {
        console.log('GeminiBot: Goodbye!');
        rl.close();
        break;
      }
  
      const result = await chat.sendMessage(userMessage);
      const response = await result.response;
      const text = response.text().replace(/```json|```/g, "").trim();
      const msgs = [text];
  
      while (true) {
        const newR = await chat.sendMessage(msgs);
        msgs.push(await newR.response.text());
        if (msgs[msgs.length - 1].includes("action")) {
          const fn = tools[JSON.parse(msgs[msgs.length - 1].replace(/```json|```/g, "")).function];
          fn(JSON.parse(msgs[msgs.length - 1].replace(/```json|```/g, "").trim()).city);
          msgs.push(`{"type": "observation","observation": "It's ${fn(JSON.parse(msgs[msgs.length - 1].replace(/```json|```/g, "").trim()).city)} in ${JSON.parse(msgs[msgs.length - 1].replace(/```json|```/g, "").trim()).city}"}`);
        }
        if (msgs[msgs.length - 1].includes("output")) {
          console.log("GeminiBot:", JSON.parse(msgs[msgs.length - 1].replace(/```json|```/g, "").trim()).output);
          break;
        }
        if (msgs[msgs.length - 1].includes("response")) {
          console.log("GeminiBot:", JSON.parse(msgs[msgs.length - 1].replace(/```json|```/g, "").trim()).response);
          break;
        }
      }
    
    }
  }

async function runAgent() {
  console.log("Initializing Agent...");
  const chat = await initializeAgent();
  console.log("GeminiBot: Hello! I'm a weather agent. How can I help you today?");
  interactWithUser(chat);
}

// Run the AI agent
runAgent();