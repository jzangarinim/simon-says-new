import React from "react";

export default function Scoreboard({
  score,
  highScore,
  reactionScore,
  totalReactionScore,
  reactionBarWidth,
  reactionHighScore,
}) {
  return (
    <div className="bg-gray-900/80 text-white rounded-xl p-4 shadow-lg w-64 mb-4">
      <div className="flex justify-between mb-2">
        <span>Score:</span>
        <span>{score}</span>
      </div>
      <div className="flex justify-between mb-2">
        <span>High Score:</span>
        <span>{highScore}</span>
      </div>
      <div className="flex justify-between mb-1">
        <span>Speed Score:</span>
        <span>{reactionScore}</span>
        <span>{totalReactionScore}</span>
      </div>
      <div className="flex justify-between mb-2">
        <span>Speed High Score:</span>
        <span>{reactionHighScore}</span>
      </div>
      <div className="relative h-4 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`absolute top-0 left-0 h-full bg-green-400 ${
            reactionBarWidth > 70
              ? "bg-green-400"
              : reactionBarWidth < 33
              ? "bg-red-600"
              : "bg-orange-500"
          } transition-all duration-100`}
          style={{
            width: `${reactionBarWidth}%`,
            transition: "width 50ms linear",
          }}
        ></div>
      </div>
    </div>
  );
}
