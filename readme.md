
# AI agent implemented using gemini
Implemented from [this](https://www.youtube.com/watch?v=vUYnRGotTbo&t=1s) video but instead of chatgpt API gemini is used(becaues I don't have money)

# Usage

Clone the project
```bash
git clone https://github.com/Rohit-00/AI-Agent-With-Gemini.git
```
Install the dependencies
```bash
npm i
```
Create a `.env` file and add gemini key like this
```
GEMINI_API_KEY = "your api key"
```
Run the agent 
```bash
npm run agent
```
# Additional info
You can change the gemini model but gemini-1.5-flash worked the best.
Also I changed the system prompt a little bit from the video to make it suitable for the gemini.

# Take it further
You can toy with the prompt and make it interact with some other tools to make some cool stuff. I'm thinking of using sqlite as a tool to make it interact with user data. Don't forget to ping me if you're making anything cool with it :)