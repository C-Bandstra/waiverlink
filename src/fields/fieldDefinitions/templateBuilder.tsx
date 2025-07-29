import type { JSX } from "react";
export type FieldType =
  | "textarea"
  | "name"
  | "signature"
  | "date"
  | "input"
  | "checkbox"
  | "radio"
  | "dropdown";

export const templateBuilderFieldDefinitions: Record<
  FieldType,
  { render: () => JSX.Element }
> = {
  textarea: {
    render: () => {
      const label = "Preview label";
      return (
        <div className="flex flex-col space-y-1">
          {label && (
            <label className="text-sm font-medium text-gray-700">{label}</label>
          )}
          <textarea
            placeholder="Enter text..."
            className="w-[300px] p-2 border rounded-lg text-sm min-h-[80px] resize-x bg-gray-100"
          />
        </div>
      );
    },
  },

  name: {
    render: () => {
      return (
        <strong
          className="text-base font-semibold text-gray-800"
        >
          *John Doe
        </strong>
      );
    },
  },

  signature: {
    render: () => {
      return (
        <span
          className="inline-block min-w-[150px] border-b border-gray-500 italic text-gray-600"
        >
          Click to sign
        </span>
      );
    },
  },

  date: {
    render: () => {
      return (
          <input
            type="date"
            className="border px-2 py-1 rounded"
            // value="Date value"
          />
      );
    },
  },

  input: {
    render: () => {
      const label = "Preview input value";
      return (
        <input
          type="text"
          className="border px-2 py-1 rounded text-sm text-gray-700 bg-gray-100 w-[300px]"
          placeholder={label}
        />
      );
    },
  },

  checkbox: {
    render: () => {
      const label = "*Label";
      return (
        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            className="mt-1"
          />
          <label className="text-sm text-gray-700">
            {label}
          </label>
        </div>
      );
    },
  },

  radio: {
    render: () => {
      const options = ["Option 1", "Option 2", "Option 3"];
      const groupName = "radio-group"; // Can be dynamic if needed

      return (
        <div className="flex flex-col space-y-2">
          {options.map((option, index) => (
            <label
              key={index}
              className="text-sm text-gray-700 flex items-center space-x-2"
            >
              <input type="radio" name={groupName} value={option} />
              <span>{option}</span>
            </label>
          ))}
        </div>
      );
    },
  },

  dropdown: {
    render: () => {
      // const label = "Choose option";
      const options = ["Option 1", "Option 2", "Option 3"];
      return (
        <div className="flex flex-col space-y-1">
          {/* <label className="text-sm text-gray-700">{label}</label> */}
          <select
            className="border border-gray-300 rounded px-2 py-1 text-sm bg-gray-100 text-gray-700"
          >
            <option value="">-- Choose one --</option>
            {options.map((opt, index) => (
              <option key={index}>{opt}</option>
            ))}
          </select>
        </div>
      );
    },
  },
};
