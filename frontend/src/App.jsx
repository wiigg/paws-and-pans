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
    <>
      <h1>Paws and Pans</h1>
      <p>
        Welcome to Paws and Pans! 🐾🍳 Enter the ingredients you have at hand,
        and your furry kitchen helper will guide you through a delicious
        recipe!
      </p>
      <p>
        {charStory && (
          <>
              <img
                src={charImage}
                alt="Your furry kitchen helper"
                style={{ height: "300px" }}
              />
            <br />
            <span>
              <strong>{charStory}</strong>
            </span>
          </>
        )}
      </p>
      <div>
        <IngredientsForm />
      </div>
    </>
  );
}

export default App;
