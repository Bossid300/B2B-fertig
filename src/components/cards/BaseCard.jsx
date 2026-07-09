import React from "react";

export default function BaseCard({
  children,
  className = "",
  onClick,
  selected = false
}) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-slate-950
        border
        rounded-2xl
        overflow-hidden
        transition-all
        duration-300
        shadow-2xl
        cursor-pointer

        ${
          selected
            ? "border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
            : "border-slate-900 hover:border-slate-800"
        }

        ${className}
      `}
    >
      {children}
    </div>
  );
}