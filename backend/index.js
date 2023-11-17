import OpenAI from "openai";

import {
  systemPrompt,
  backstoryPrompt,
  recipePrompt,
} from "./utils/prompts/templates";

const openai = new OpenAI(process.env.OPENAI_API_KEY);

// store chat history in memory
const chatHistory = [];

const server = Bun.serve({
  port: 3000,
  fetch: async (req) => {
    const url = new URL(req.url);
    if (url.pathname === "/generatecharacter") {
      // Clear chat history
      chatHistory.length = 0;

      // Declare system message
      chatHistory.push({ role: "system", content: `${systemPrompt}` });
      chatHistory.push({ role: "user", content: `${backstoryPrompt}` });

      // Generate character backstory
      const backstory = await generateCompletion(chatHistory);
      chatHistory.push({ role: "assistant", content: `${backstory}` });

      // Generate character image
      //   const imageUrl = await generateImage(backstory);
      const imageUrl = "cat.png";

      return new Response(JSON.stringify({ backstory, imageUrl }), {
        headers: { "Content-Type": "application/json" },
      });
    }
    if (url.pathname === "/generaterecipe") {
      // Extract user-inputted ingredients from request
      const ingredients = req.body.ingredients;
      const combinedPrompt = recipePrompt + ingredients;
      chatHistory.push({ role: "user", content: `${combinedPrompt}` });

      // Generate recipe
      const recipe = await generateCompletion(chatHistory);

      return new Response(JSON.stringify({ recipe }), {
        headers: { "Content-Type": "application/json" },
      });
    }
  },
});

const generateCompletion = async (messages) => {
  const model = "gpt-4-1106-preview";
  const response = await openai.chat.completions.create({
    model,
    messages,
  });

  return response.choices[0].message.content;
};

const generateImage = async (prompt) => {
  const model = "dall-e-3";
  const image = await openai.images.generate({
    model,
    prompt,
    n: 1,
    size: "1024x1024",
  });

  return image.data[0].url;
};

console.log(`Listening on http://localhost:${server.port} ...`);
