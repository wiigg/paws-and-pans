import { useQuery } from "react-query";
import { useState } from "react";

import IngredientsForm from "./components/IngredientsForm";
import generateService from "./services/generate";
import { useEffect } from "react";

function App() {
  const [charStory, setCharStory] = useState(null);
  const [charImage, setCharImage] = useState(null);

  const generateCharacter = useQuery(
    "generateCharacter",
    generateService.getCharacter,
    {
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );

  useEffect(() => {
    if (generateCharacter.data) {
      setCharStory(generateCharacter.data.backstory);
      setCharImage(generateCharacter.data.image);
    }
  }, [generateCharacter.data]);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-5xl text-center text-indigo-600 font-bold my-6">
        Paws and Pans
      </h1>
      <p className="text-center text-lg text-gray-700">
        Welcome to Paws and Pans! 🐾🍳 Enter the ingredients you have at hand,
        and your furry kitchen helper will guide you through a delicious recipe!
      </p>
      <div className="text-center my-4">
        {charStory && (
          <>
            <img
              src={charImage}
              alt="Your furry kitchen helper"
              className="mx-auto h-72 shadow-lg border border-gray-200"
            />
            <br />
            <p className="text-md text-gray-600 font-semibold mt-2">
              {charStory}
            </p>
          </>
        )}
      </div>
      <div className="flex justify-center">
        <IngredientsForm generateRecipe={generateService.getRecipe} />
      </div>
    </div>
  );
}

export default App;
