import readline from "readline";
import { weather } from "./weatherFunc.js";

const tools = {
    "weather": weather
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


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
          msgs.push(`{"type": "observation","observation": "It's ${fn(JSON.parse(msgs[msgs.length - 1].replace(/```json|```/g, "").trim()).city)} 
          in ${JSON.parse(msgs[msgs.length - 1].replace(/```json|```/g, "").trim()).city}"}`);
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

  export default interactWithUser;
