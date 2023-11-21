import { useQuery } from "react-query";
import { useState } from "react";
import { useEffect } from "react";

import IngredientsForm from "./components/IngredientsForm";
import generateService from "./services/generate";

function App() {
  const [charDescription, setCharDescription] = useState(null);
  const [charStory, setCharStory] = useState(null);
  const [charImage, setCharImage] = useState(null);

  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [isLoadingBackstory, setIsLoadingBackstory] = useState(false);

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
      setCharDescription(generateCharacter.data);
    }
  }, [generateCharacter.data]);

  useEffect(() => {
    setIsLoadingImage(true);
    if (charDescription) {
      generateService.getImage(charDescription).then((data) => {
        setCharImage(data);
        setIsLoadingImage(false);
      });
    }
  }, [charDescription]);

  useEffect(() => {
    setIsLoadingBackstory(true);
    if (charDescription) {
      generateService.getBackstory(charDescription).then((data) => {
        setCharStory(data);
        setIsLoadingBackstory(false);
      });
    }
  }, [charDescription]);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-5xl text-center text-indigo-600 font-bold my-6">
        Paws and Pans
      </h1>
      <p className="text-center text-lg text-gray-700">
        Enter the ingredients you have at hand, and your furry kitchen helper
        will guide you through a delicious recipe! 🐾🍳
      </p>
      <div className="text-center my-4">
      {isLoadingImage ? (
        <div>Loading image...</div> // or use a spinner component
      ) : charImage ? (
        <img
          src={charImage}
          alt="Your furry kitchen helper"
          className="mx-auto h-72 shadow-lg border border-gray-200"
        />
      ) : null}
      {isLoadingBackstory ? (
        <div>Loading story...</div> // or use a spinner component
      ) : charStory ? (
        <p className="text-md text-gray-600 font-semibold mt-2">
          {charStory}
        </p>
      ) : null}
      </div>
      <div className="flex justify-center">
        <IngredientsForm generateRecipe={generateService.getRecipe} />
      </div>
    </div>
  );
}

export default App;
