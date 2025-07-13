import { useState, useEffect } from "react";

export default function FlashLayer({ color, text, onDone }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      onDone?.();
    }, 600);
    return () => clearTimeout(t);
  }, [color, onDone]);

  if (!visible) return null;

  return (
    <div className="z-50 absolute inset-0 flex items-center justify-center pointer-events-none animate-pulse">
      {/* circular coloured glow */}
      <div className="absolute w-full h-full rounded-full overflow-hidden">
        <div className="w-full h-full" style={{ backgroundColor: color }} />
      </div>

      {/* centred text */}
      {text && (
        <span className="relative text-4xl text-white font-bold z-10">
          {text}
        </span>
      )}
    </div>
  );
}
