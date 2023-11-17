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
    <div>
      <h2>Enter your ingredients:</h2>
      <form onSubmit={handleSubmit}>
        {ingredientList.map((ingredient, index) => (
          <div key={index}>
            <input
              type="text"
              value={ingredient}
              onChange={(e) => handleIngredientChange(e, index)}
            />
          </div>
        ))}
        <button type="button" onClick={handleAddIngredient}>
          Add Another
        </button>
        <div>
          <button type="submit">Generate!</button>
        </div>
      </form>
      <div>
        {recipe && (
          <>
            <h2>Here is your recipe!</h2>
            <div>{renderTextWithLineBreaks(recipe)}</div>
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
