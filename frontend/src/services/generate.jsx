import axios from "axios";

const baseUrl = "http://localhost:3000/api";

const getCharacter = async () => {
  const response = await axios.get(`${baseUrl}/generatecharacter`);

  const { backstory, image } = response.data;

  return { backstory, image };
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

export default { getCharacter, getRecipe };
