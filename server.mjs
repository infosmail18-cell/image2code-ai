require('dotenv').config();
const express = require('express');
const multer = require('multer');
const { HfInference } = require('@huggingface/inference');
const OpenAI = require('openai');
const path = require('path');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Clients
const hf = new HfInference(process.env.HF_TOKEN);
const deepseek = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY,
});

// Serve static frontend
app.use(express.static('public'));

// API endpoint
app.post('/api/convert', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload an image' });
    }

    // 1. Image → description using BLIP (free)
    const blipResult = await hf.imageToText({
      model: 'Salesforce/blip-image-captioning-large',
      data: req.file.buffer,
    });
    const description = blipResult.generated_text;

    // 2. Description → HTML/CSS via DeepSeek
    const completion = await deepseek.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: 'You are an expert front-end developer. Return ONLY valid HTML/CSS code inside ```html ... ``` block. Make it responsive, modern, and match the description exactly.'
        },
        {
          role: 'user',
          content: `Generate a complete, self-contained, responsive HTML/CSS webpage based on this description: ${description}`
        }
      ],
      max_tokens: 4000,
      temperature: 0.2,
    });

    let htmlCode = completion.choices[0].message.content;
    // Extract code from markdown if needed
    const match = htmlCode.match(/```html([\s\S]*?)```/);
    if (match) htmlCode = match[1].trim();

    res.json({ success: true, html: htmlCode, description });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});