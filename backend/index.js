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
      // const image = await generateImage(description);
      const image = "cat.png";

      // Generate character backstory
      console.log("Generating backstory...");
      chatHistory.push({ role: "user", content: `${backstoryPrompt}` });
      const backstory = await generateCompletion(chatHistory);
      chatHistory.push({ role: "assistant", content: `${backstory}` });

      console.log("Returning character...");

      return new Response(JSON.stringify({ backstory, image }), {
        headers: { "Content-Type": "application/json" },
      });
      // return new Response("some response");
    }
    if (url.pathname === "/api/generaterecipe") {
      let chunks = [];
      for await (const chunk of req.body) {
        chunks.push(chunk);
      }

      let body = Buffer.concat(chunks).toString("utf-8"); // Convert byte array to string
      const parsedBody = JSON.parse(body); // Parse string as JSON
      const ingredientsArray = parsedBody.ingredients;
      const ingredients = ingredientsArray.join(", ");

      // Generate recipe
      console.log("Generating recipe...");
      const combinedPrompt = recipePrompt + ingredients;
      chatHistory.push({ role: "user", content: `${combinedPrompt}` });
      const recipe = await generateCompletion(chatHistory);

      console.log("Returning recipe...");

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
