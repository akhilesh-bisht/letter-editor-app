import { useState } from "react";

export default function Toggle({
  pressed,
  onPressedChange,
  children,
  ariaLabel,
}) {
  const [isPressed, setIsPressed] = useState(pressed);

  const handleClick = () => {
    setIsPressed(!isPressed);
    onPressedChange();
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 border rounded-md ${
        isPressed ? "bg-blue-500 text-white" : "bg-gray-200"
      }`}
      aria-pressed={isPressed}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
