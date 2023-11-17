import IngredientsForm from "./components/IngredientsForm";

function App() {
  return (
    <>
      <h1>Paws and Pans</h1>
      <p>
        Welcome to Paws and Pans! 🐾🍳 Please enter the ingredients you have at
        hand, and I&apos;ll introduce you to your furry kitchen helper who will
        guide you through a delicious recipe!
      </p>
      <div>
        <IngredientsForm />
      </div>
    </>
  );
}

export default App;
