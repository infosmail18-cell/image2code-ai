# Image2Code - Convert UI images to HTML with AI

## Setup
1. Clone or copy this folder.
2. Run `npm install`
3. Create `.env` file with your API keys:
   - `DEEPSEEK_API_KEY` (from platform.deepseek.com)
   - `HF_TOKEN` (from huggingface.co/settings/tokens)
4. Run `npm start` or `npm run dev`
5. Open `http://localhost:3000`

## How it works
- User uploads an image → BLIP model (HuggingFace) generates a text description.
- Description is sent to DeepSeek API → outputs full responsive HTML/CSS.

## Free tier limits
- HuggingFace inference: ~30 requests/minute free.
- DeepSeek API: cheap (¥1 per million tokens).

## Tech stack
- Backend: Node.js + Express
- Frontend: HTML/CSS vanilla
- AI: Salesforce BLIP + DeepSeek-chat