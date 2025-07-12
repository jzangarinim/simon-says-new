import { useState, useEffect } from "react";

const colorIds = ["green", "red", "yellow", "blue"];
const startNumber = 4;

function App() {
  const [order, setOrder] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [activeColor, setActiveColor] = useState(null);
  const [flashDuration, setFlashDuration] = useState(600); // Sets the flash duration for colors at 600 ms initially
  const [countdown, setCountdown] = useState(null);
  const [playerOrder, setPlayerOrder] = useState([]);

  const colors = [
    // Four basic Simon Says colors, could look for some way to let user change colors themselves, soonTM
    {
      id: "green",
      colorClass: "bg-green-400",
      positionClass: "top-0 left-0 rounded-tl-full",
    },
    {
      id: "red",
      colorClass: "bg-red-400",
      positionClass: "top-0 right-0 rounded-tr-full",
    },
    {
      id: "yellow",
      colorClass: "bg-yellow-300 bottom-0 left-0 rounded-bl-full",
      positionClass: "bottom-0 left-0",
    },
    {
      id: "blue",
      colorClass: "bg-blue-400",
      positionClass: " bottom-0 right-0 rounded-br-full",
    },
  ];

  useEffect(() => {
    // Color flashing
    if (order.length === 0) return; // Just in case
    if (!gameStarted) return;

    order.forEach((color, index) => {
      setTimeout(() => {
        setActiveColor(color); // Lights up the currently active color
        setTimeout(() => setActiveColor(null), flashDuration); // Turns off after flashDuration
      }, index * flashDuration * 1.2); // 1.2 is a 20% increase to flashDuration, acting as a 20% buffer between colors based on duration
    });
  }, [order, flashDuration, gameStarted]);

  useEffect(() => {
    // Generates an initial random order of colors on mount, saved in newOrder
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

  useEffect(() => {
    if (playerOrder.length === 0) return;

    const currentIndex = playerOrder.length - 1;
    if (playerOrder[currentIndex] !== order[currentIndex]) {
      // Resets playerOrder on wrong input
      alert("Wrong sequence! Try again.");
      setPlayerOrder([]);
      return;
    }

    if (playerOrder.length === order.length) {
      alert("Correct! Get ready for the next round.");
      // Add new color to sequence and reset playerOrder
      const newColor = Math.floor(Math.random() * colorIds.length);
      setOrder((order) => [...order, colorIds[newColor]]);
      setPlayerOrder([]);
    }
  }, [playerOrder]);

  return (
    <>
      <div className="relative w-96 h-96 mx-auto">
        {/* Countdown display (on top of everything) */}
        {countdown !== null && (
          <div
            className="absolute z-50 top-1/2 left-1/2 
              transform -translate-x-1/2 -translate-y-1/2 
            text-white text-6xl font-bold 
              pointer-events-none select-none animate-pulse"
          >
            {countdown}
          </div>
        )}

        {colors.map((color) => (
          // Color buttons
          <button
            key={color.id}
            className={`absolute z-10 w-1/2 h-1/2 
              shadow-gray-100/50 inset-shadow-white-100/50
              border-4 border-black cursor-pointer 
              transition-all duration-200 
              ${color.colorClass} 
              ${color.positionClass}
              ${activeColor === color.id ? "brightness-125 shadow-2xl" : ""}
              `}
            onClick={() => {
              setPlayerOrder([...playerOrder, color.id]);
            }}
          />
        ))}

        {/* Start button */}
        <button
          className={`absolute z-10 top-1/2 left-1/2 text-3xl
              w-24 h-24 rounded-full border-4 
              transform -translate-x-1/2 -translate-y-1/2
              bg-gray-800 border-white text-white cursor-pointer
              ${gameStarted || countdown !== null ? "visible" : "visible"}
              `}
          onClick={() => {
            if (gameStarted == false) {
              let count = 3;
              setCountdown(count);
              const countdownInterval = setInterval(() => {
                count -= 1;
                if (count === 0) {
                  clearInterval(countdownInterval);
                  setCountdown(null);
                  setGameStarted(true);
                } else {
                  setCountdown(count);
                }
              }, 1000);
            } else {
              console.log("ola");
            }
          }}
        >
          {`${gameStarted ? "II" : "Start"}`}
        </button>
      </div>
    </>
  );
}

export default App;
