import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

export default function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      {...props}
      className={`font-inter leading-4 tracking-[-0.13px] w-full border-0 px-6 py-4 rounded-xl bg-icon shadow-input focus:shadow-input-hover focus:outline-0 ${className}`}
    />
  );
}
