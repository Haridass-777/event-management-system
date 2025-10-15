 import React from "react";
import "./Bubble.css";
  

function Bubble() {
  const bubbleCount = 10;
  const bubbles = Array.from({ length: bubbleCount }).map((_, i) => {
    const left = Math.round(Math.random() * 100); // percent
    const size = Math.round(30 + Math.random() * 100); // px (adjust size)
    const delay = (Math.random() * -8).toFixed(2) + "s";
    const duration = (8 + Math.random() * 12).toFixed(2) + "s";

    return (
      <img
        key={i}
        src="./assets/logo.png"
        alt="logo"
        className="bubble-logo"
        style={{
          ['--left']: `${left}%`,
          ['--size']: `${size}px`,
          ['--delay']: delay,
          ['--dur']: duration,
        }}
      />
    );
  });

  return (
    <div className="bubble-background" aria-hidden>
      <div className="bubbles">{bubbles}</div>
    </div>
  );
}

export default Bubble;
