import React from "react";
import type { Event } from "../types";

interface ToggleProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: Event) => void;
  className?: string;
}

const Toggle: React.FC<ToggleProps> = ({ id, label, checked, onChange, className }) => {
  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      {/* Toggle Switch */}
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e: Event) => onChange(e)}
        className="sr-only"
      />
      <label
        htmlFor={id}
        className={`relative w-11 h-6 cursor-pointer rounded-full ${
          checked ? "bg-blue-600" : "bg-gray-300"
        } transition-colors duration-200`}
      >
        <span
          className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </label>

      {/* Label text */}
      <label htmlFor={id} className="select-none text-sm text-gray-800">
        {label}
      </label>
    </div>
  );
};

export default Toggle;
