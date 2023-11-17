import { useState } from "react";

function IngredientsForm() {
  const [ingredientList, setIngredientList] = useState([""]);

  function handleAddIngredient() {
    setIngredientList([...ingredientList, ""]);
  }

  function handleIngredientChange(e, index) {
    const updatedList = [...ingredientList];
    updatedList[index] = e.target.value;
    setIngredientList(updatedList);
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(ingredientList);
  }

  return (
    <div>
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
          Add Another Ingredient
        </button>
        <div>
          <button type="submit">Generate!</button>
        </div>
      </form>
    </div>
  );
}

export default IngredientsForm;
