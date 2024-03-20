import React from "react";
import Spinner from "./Spinner";
// import Spinner from "./Spinner";
export default function Button({
  children,
  type = "button",
  className = "",
  disabled,
  loading,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={` bg-[#4F46E5] outline-none py-2 px-3 text-center text-sm font-medium rounded-[8px] text-white hover:bg-[#4e46f7] ${
        disabled && "opacity-50"
      } ${className}`}
      {...props}
    >
      {
        loading? <Spinner/> : children
      }
    </button>
  );
}
