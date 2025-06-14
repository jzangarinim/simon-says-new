import { useState, useEffect } from "react";

const colorIds = ["green", "red", "yellow", "blue"];
const startNumber = 4;

function App() {
  const [order, setOrder] = useState([]);

  const colors = [
    { id: "green", className: "bg-green-400 top-0 left-0 rounded-tl-full" },
    { id: "red", className: "bg-red-400 top-0 right-0 rounded-tr-full" },
    {
      id: "yellow",
      className: "bg-yellow-300 bottom-0 left-0 rounded-bl-full",
    },
    { id: "blue", className: "bg-blue-400 bottom-0 right-0 rounded-br-full" },
  ];

  useEffect(() => {
    const generateInitialOrder = () => {
      const newOrder = [];
      for (let i = 0; i < startNumber; i++) {
        const randomIndex = Math.floor(Math.random() * colorIds.length);
        newOrder.push(colorIds[randomIndex]);
      }
      setOrder(newOrder);
    };

    generateInitialOrder();
  }, []);

  return (
    <>
      <div className="relative w-96 h-96 mx-auto">
        {colors.map((color) => (
          <button
            key={color.id}
            className={`absolute w-1/2 h-1/2 ${color.className} border-4 border-black cursor-pointer`}
            onClick={() => {
              console.log(`You clicked ${color.id}!`);
            }}
          ></button>
        ))}
        <button
          className="absolute top-1/2 left-1/2 w-24 h-24 bg-gray-800 rounded-full border-4 border-white transform -translate-x-1/2 -translate-y-1/2 cursor-pointer text-white"
          onClick={() => {
            console.log(`This is supposed to be how you start the game`);
          }}
        >
          Start
        </button>
      </div>
    </>
  );
}

export default App;
