import axios from "axios";

const baseUrl = "http://localhost:3000/api";

const getCharacter = async () => {
  const response = await axios.get(`${baseUrl}/generatecharacter`);

  return response.data.description;
};

const getImage = async (character) => {
  console.log(character);
  const response = await axios.post(
    `${baseUrl}/generateimage`,
    {
      character,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.image;
};

const getBackstory = async ({ character }) => {
  const response = await axios.post(
    `${baseUrl}/generatebackstory`,
    {
      character,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.backstory;
};

const getRecipe = async ({ ingredients }) => {
  const response = await axios.post(
    `${baseUrl}/generaterecipe`,
    {
      ingredients,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.recipe;
};

export default { getCharacter, getImage, getBackstory, getRecipe };
