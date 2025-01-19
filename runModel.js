import { GoogleGenerativeAI } from "@google/generative-ai";
import readlineSync from 'readline-sync' ;

const system_prompt = `
You're an AI assitant with START, PLAN, ACTION, Observation, and Reflection capabilities.
Wait for the user prompt and first PLAN using available tools.
After planing use take the action with appropriate tools and wait for Observation based on Action.
Once you get the observation, Return the AI response based on START prompt and observations.

Available Tools:
function weather(city:string) : string
weather function is available to get the weather of the city. It accepts city name as input and returns the weather of the city.

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

`
async function run(input) {
    const genAI = new GoogleGenerativeAI("AIzaSyB9uvbtyo69OPWjRZJPvmbiez7uYRC3kqQ");
    while (true){
        const query = readlineSync.question('Ask me a question: ');
   
    try{
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
          const prompt =[
                {
                    role: "user",
                    parts: [{text:input}]
                },
                {
                    role: "model",
                    parts: [{text:system_prompt}]
                }
                
            ]
        const chat = model.startChat({
                history: prompt,
              });
          
          const result = await chat.sendMessage(input);
          const response = await result.response;
          const text = response.text();
          return(text)
        }
        catch(err){
          console.log(err)
        }}
        }

       
export default run;