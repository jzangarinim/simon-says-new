import { useState, useEffect } from "react";
import RestartModal from "./components/RestartModal";
import Scoreboard from "./components/Scoreboard";
import FlashLayer from "./components/FlashLayer";
import { createRipple } from "./components/Ripple";
import { playSound } from "./utils/sounds.js";
import { Drawer, IconButton, Box, Slider } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

const colorIds = ["green", "red", "yellow", "blue"];
const startNumber = 4;

function App() {
  const [order, setOrder] = useState([]); // Color order
  const [gameStarted, setGameStarted] = useState(false); // Game started state
  const [activeColor, setActiveColor] = useState(null); // Currently flashing color
  const [flashDuration, setFlashDuration] = useState(600); // Sets the flash duration for colors at 600 ms initially (will update later)
  const [isFlashing, setIsFlashing] = useState(false); // Color flashing state to disable inputs
  const [countdown, setCountdown] = useState(null); // Initial countdown upon pressing Start
  const [playerOrder, setPlayerOrder] = useState([]); // Stores the player's color inputs to compare with order
  const [showRestartModal, setShowRestartModal] = useState(false); // Restart modal that renders upon clicking button when gameStarted = true
  const [score, setScore] = useState(0); // Player's score, +1 after correctly inputing a sequence
  const [highScore, setHighScore] = useState(
    () => parseInt(localStorage.getItem("highscore")) || 0
  ); // Local storage of player's highest score
  const [reactionScore, setReactionScore] = useState(0); // Player's "reaction" score, measuring the time the player took per color input
  const [totalReactionScore, setTotalReactionScore] = useState(0); // Adds up the player's reaction or speed score across a game
  const [reactionHighScore, setReactionHighScore] = useState(
    () => parseInt(localStorage.getItem("reactionHighscore")) || 0
  ); // Local storage of player's highest speed score
  const [reactionBarWidth, setReactionBarWidth] = useState(100); // Decreasing reaction bar for user viewing
  const [startTime, setStartTime] = useState(null); //
  const [timerInterval, setTimerInterval] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false); // Shows green layer on correct order input
  const [showError, setShowError] = useState(false); // Shows red layer on incorrect order input
  const [drawerOpen, setDrawerOpen] = useState(false); // Shows red layer on incorrect order input

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

  function valuetext(value) {
    return `${value} ms`;
  }

  const resetGame = () => {
    // Reset everything after pressing restart
    const newOrder = [];
    for (let i = 0; i < startNumber; i++) {
      const randomIndex = Math.floor(Math.random() * colorIds.length);
      newOrder.push(colorIds[randomIndex]);
    }
    setOrder(newOrder);
    setPlayerOrder([]);
    setGameStarted(false);
    setCountdown(null);
    setShowRestartModal(false);
    setScore(0);
    setReactionBarWidth(100);
    setReactionScore(0);
    setTotalReactionScore(0);
  };

  // Event handling
  const handlePlayerClick = (colorId) => {
    if (!gameStarted || isFlashing || countdown !== null || showSuccess) return; // Disable user inputs before game has started or while colors are flashing

    // Records player color inputs
    const updatedOrder = [...playerOrder, colorId];
    setPlayerOrder(updatedOrder);

    // Check if the updated sequence is complete
    if (updatedOrder.length === order.length) {
      // Stop timer for Speed score
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
        setScore((prev) => prev + 1);
        setTotalReactionScore((prev) => prev + reactionScore);
      }

      setReactionBarWidth(100);
    }
  };

  // Effects
  // Speed timer useEffect
  useEffect(() => {
    // Reaction timer measure
    if (!isFlashing && gameStarted) {
      const start = Date.now();
      setStartTime(start);

      const interval = setInterval(() => {
        const elapsed = Date.now() - start;
        const bonus = Math.max(0, 100 - elapsed / 50); // slower decay: 5s max time; 1s per 10
        setReactionScore(Math.floor(bonus));
        setReactionBarWidth(bonus);

        if (bonus <= 0) clearInterval(interval);
      }, 50); // update every 50ms

      setTimerInterval(interval); // Storing in order to clear afterwards

      return () => clearInterval(interval);
    }
  }, [isFlashing, gameStarted]);

  // Highscore update useEffect
  useEffect(() => {
    // Highscore update
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("highscore", score);
    }
    if (totalReactionScore > reactionHighScore) {
      setReactionHighScore(totalReactionScore);
      localStorage.setItem("reactionHighscore", totalReactionScore);
    }
  }, [score]);

  // Color Flashing logic useEffect
  useEffect(() => {
    // Color flashing
    if (order.length === 0) return; // Just in case
    if (!gameStarted) return;

    setIsFlashing(true);

    order.forEach((color, index) => {
      setTimeout(() => {
        setActiveColor(color); // Lights up the currently active color
        setTimeout(() => setActiveColor(null), flashDuration); // Turns off after flashDuration
      }, index * flashDuration * 1.2); // 1.2 is a 20% increase to flashDuration, acting as a 20% buffer between colors based on duration
    });

    // Calculate amount of time that buttons will be inactive due to flashing, plus a small buffer
    const totalFlashTime = order.length * flashDuration * 1.2;
    const buffer = 200;

    setTimeout(() => {
      setIsFlashing(false); //
    }, totalFlashTime + buffer);
  }, [order, flashDuration, gameStarted]);

  // Initial color order useEffect
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

  // Player input comparison vs initial order useEffect
  useEffect(() => {
    if (playerOrder.length === 0) return;

    const currentIndex = playerOrder.length - 1;

    // Resets playerOrder on wrong input
    if (playerOrder[currentIndex] !== order[currentIndex]) {
      // Just for fun :)
      const badLuck = Math.floor(Math.random() * 100 + 1);
      if (badLuck > 95) {
        playSound("loud-buzzer");
      } else {
        playSound("error");
      }
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
        setPlayerOrder([]);
      }, 600);
      return;
    }

    if (playerOrder.length === order.length) {
      setShowSuccess(true);
      playSound("correct");
      // Delay between rounds
      setTimeout(() => {
        setShowSuccess(false);

        // Add a new color
        const newColor = colorIds[Math.floor(Math.random() * colorIds.length)];
        setOrder([...order, newColor]);
        setPlayerOrder([]);
        setReactionBarWidth(100);
        setReactionScore(0);
      }, 1500); // 1.5-second delay between rounds
    }
  }, [playerOrder]);

  return (
    <div className="relative min-h-screen bg-gray-900 text-white flex flex-col items-center justify-start pt-8">
      <Drawer
        anchor="top"
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
        }}
        sx={{
          "& .MuiDrawer-paper": {
            bgcolor: "#111827", // tailwind gray-900
            color: "#ffffff",
            borderBottom: "1px solid #374151",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            pt: 5,
            pb: 3, // padding so the slider doesn’t touch the edges
          },
        }}
      >
        <Box sx={{ width: "auto" }} className="flex-col items-center">
          <Slider
            sx={{ width: 300 }}
            defaultValue={600}
            aria-label="Game speed"
            getAriaValueText={valuetext}
            valueLabelDisplay="auto"
            value={flashDuration}
            onChange={(_, v) => setFlashDuration(v)}
            step={100}
            min={100}
            max={900}
            marks
          />
        </Box>
      </Drawer>
      <div className="flex">
        <h1 className="text-4xl font-bold mb-4 pr-3">Simon Says</h1>
        <IconButton
          color="success"
          onClick={() => {
            setDrawerOpen(true);
          }}
        >
          <SettingsIcon />
        </IconButton>
      </div>
      <Scoreboard
        score={score}
        highScore={highScore}
        reactionScore={reactionScore}
        totalReactionScore={totalReactionScore}
        reactionBarWidth={reactionBarWidth}
        reactionHighScore={reactionHighScore}
      />
      <div className={`relative w-96 h-96 mx-auto`}>
        {(showError || showSuccess) && (
          <FlashLayer
            color={showError ? "rgba(220,38,38,0.4)" : "rgba(34,197,94,0.4)"}
            text={showError ? "Wrong!" : undefined}
            onDone={() => {
              setShowError(false);
              setShowSuccess(false);
            }}
          />
        )}

        {/* Countdown display (on top of everything z-50) */}
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
              border-3 border-black
              transition-all duration-200 
              ${color.colorClass} 
              ${color.positionClass}
              ${activeColor === color.id ? "glow-active" : ""}
              ${
                isFlashing
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:brightness-110 active:brightness-50 active:scale-98"
              }
              `}
            disabled={isFlashing}
            onMouseDown={createRipple}
            onClick={() => handlePlayerClick(color.id)}
          />
        ))}

        {/* Start button */}
        <button
          className={`absolute z-10 top-1/2 left-1/2 text-3xl
              w-24 h-24 rounded-full border-4 
              transform -translate-x-1/2 -translate-y-1/2
              bg-gray-800 border-black text-white
              ${gameStarted || countdown !== null ? "visible" : "visible"}
              ${isFlashing ? "cursor-not-allowed" : "cursor-pointer"}
              `}
          disabled={isFlashing || countdown !== null}
          onClick={() => {
            if (isFlashing || countdown !== null) return;
            if (gameStarted == false) {
              playSound("countdown");
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
              setShowRestartModal(true);
            }
          }}
        >
          {countdown !== null ? "" : gameStarted ? "II" : "Start"}
        </button>
      </div>
      {showRestartModal && (
        <RestartModal
          onClose={() => setShowRestartModal(false)}
          onRestart={resetGame}
        />
      )}
    </div>
  );
}

export default App;
