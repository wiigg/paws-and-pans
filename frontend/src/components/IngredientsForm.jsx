import React from "react";
import { useState } from "react";
import PropTypes from "prop-types";

function renderTextWithLineBreaks(text) {
  return text.split("\n").map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));
}

function IngredientsForm({ generateRecipe }) {
  const [ingredientList, setIngredientList] = useState([""]);
  const [recipe, setRecipe] = useState(null);

  function handleAddIngredient() {
    setIngredientList([...ingredientList, ""]);
  }

  function handleIngredientChange(e, index) {
    const updatedList = [...ingredientList];
    updatedList[index] = e.target.value;
    setIngredientList(updatedList);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const result = await generateRecipe({ ingredients: ingredientList });
    setRecipe(result);
    setIngredientList([""]);
  }

  return (
    <div className="max-w-md mx-auto my-8">
      <h2 className="text-2xl font-semibold text-center text-indigo-600 mb-4">
        enter your ingredients
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {ingredientList.map((ingredient, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="text"
              value={ingredient}
              onChange={(e) => handleIngredientChange(e, index)}
              className="flex-1 p-2 border border-gray-300 rounded"
              placeholder="ingredient"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddIngredient}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Another
        </button>
        <div className="text-center mt-6">
          <button
            type="submit"
            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Generate!
          </button>
        </div>
      </form>
      <div className="mt-8">
        {recipe && (
          <>
            <h2 className="text-2xl font-semibold text-center text-indigo-600 mb-4">
              Ta-dah 🎉 Here is your recipe!
            </h2>
            <div className="p-4 border border-gray-200 rounded">
              {renderTextWithLineBreaks(recipe)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

IngredientsForm.propTypes = {
  generateRecipe: PropTypes.func.isRequired,
};

export default IngredientsForm;
