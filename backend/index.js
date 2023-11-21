import OpenAI from "openai";

import {
  systemPrompt,
  characterPrompt,
  backstoryPrompt,
  recipePrompt,
} from "./utils/prompts/templates";

const openai = new OpenAI(process.env.OPENAI_API_KEY);

// store chat history in memory
const chatHistory = [];

const server = Bun.serve({
  port: 3000,
  fetch: async (req) => {
    if (req.method === "OPTIONS") {
      return new Response("", {
        headers: {
          "Access-Control-Allow-Origin": "*", // For development; specify exact origins in production
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    const url = new URL(req.url);
    if (url.pathname === "/api/generatecharacter") {
      // Clear chat history
      chatHistory.length = 0;

      // Declare system message
      chatHistory.push({ role: "system", content: `${systemPrompt}` });

      // Generate character description
      console.log("Generating character...");
      chatHistory.push({ role: "user", content: `${characterPrompt}` });
      const description = await generateCompletion(chatHistory);
      chatHistory.push({ role: "assistant", content: `${description}` });

      // Generate character image
      console.log("Generating image...");
      const image = await generateImage(description);
      // const image = "cat.png";

      console.log("Returning character...");
      return new Response(JSON.stringify({ image }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    if (url.pathname === "/api/generatebackstory") {
      console.log("Generating backstory...");
      chatHistory.push({ role: "user", content: `${backstoryPrompt}` });
      const backstory = await generateCompletion(chatHistory);
      chatHistory.push({ role: "assistant", content: `${backstory}` });

      console.log("Returning backstory...");
      return new Response(JSON.stringify({ backstory }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    if (url.pathname === "/api/generaterecipe") {
      const body = await req.json();
      const ingredientsList = body.ingredients;

      // convert ingredients list to string
      const ingredients = ingredientsList.join(", ");

      // Generate recipe
      console.log("Generating recipe...");
      const combinedPrompt = recipePrompt + ingredients;
      chatHistory.push({ role: "user", content: `${combinedPrompt}` });
      const recipe = await generateCompletion(chatHistory);

      // const recipe = "recipe";

      console.log("Returning recipe...");

      return new Response(JSON.stringify({ recipe }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
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
