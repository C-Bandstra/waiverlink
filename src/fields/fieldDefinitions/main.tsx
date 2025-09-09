import { metaToInlineStyle } from "../../utils/parsers";
import type { SubType } from "../../types";

export const baseFieldDefinitions = {
  name: {
    render: (
      _interacted: boolean,
      fieldId: string,
      _onClick: () => void,
      value?: string | React.ReactNode,
      _setValue?: (val: string) => void,
      subtype?: SubType,
      meta?: Record<string, string>,
    ) => {
      // Convert meta to inline styles and log them
      // console.log('Raw meta:', meta);
      const inlineStyles = metaToInlineStyle(meta);
      // console.log('Converted Name inlineStyles:', inlineStyles);

      return (
        <strong key={fieldId} style={inlineStyles}>
          {value}
          {subtype?.fieldName && `(${subtype?.fieldName})`}
        </strong>
      );
    },
  },

  signature: {
    render: (
      interacted: boolean,
      fieldId: string,
      onClick: () => void,
      value?: string | React.ReactNode,
      _setValue?: (val: string) => void,
      subtype?: SubType,
      meta?: Record<string, string>,
    ) => {
      // Convert meta to inline styles and log them
      // console.log('Raw meta:', meta);
      const inlineStyles = metaToInlineStyle(meta);
      // console.log('Converted Signature inlineStyles:', inlineStyles);

      return (
        <span
          key={fieldId}
          onClick={onClick}
          className="inline-block min-w-[150px] border-b border-gray-500 italic cursor-pointer"
        >
          {interacted || value ? (
            <span className="signature" style={inlineStyles}>
              {value}
            </span>
          ) : (
            <span className="signature-placeholder">
              {subtype
                ? `Click to sign (${subtype.fieldName ?? "unknown subtype"})`
                : "Click to sign"}
            </span>
          )}
        </span>
      );
    },
  },

  date: {
    render: (
      interacted: boolean,
      fieldId: string,
      onClick: () => void,
      value?: string | React.ReactNode,
      setValue?: (val: string) => void,
      subtype?: SubType,
      meta?: Record<string, string>,
    ) => {
      // Convert meta to inline styles and log them
      // console.log('Raw meta:', meta);
      const inlineStyles = metaToInlineStyle(meta);
      // console.log('Converted Date inlineStyles:', inlineStyles);

      if (setValue) {
        // Date picker for non-current subtypes
        return (
          <input
            key={fieldId}
            type="date"
            className="border px-2 py-1 rounded"
            value={value as string}
            onChange={(e) => setValue(e.target.value)}
            onClick={onClick}
            style={inlineStyles}
          />
        );
      }
      // Current date display
      return (
        <span
          key={fieldId}
          onClick={onClick}
          className="inline-block min-w-[150px] border-b border-gray-500 text-gray-400 italic cursor-pointer"
          style={inlineStyles}
        >
          {interacted
            ? value
            : subtype
              ? `Click to date (${subtype.fieldName ?? "unknown subtype"})`
              : "Click to date"}
        </span>
      );
    },
  },

  input: {
    render: (
      _interacted: boolean,
      fieldId: string,
      onClick: () => void,
      value?: string | React.ReactNode,
      setValue?: (val: string) => void,
      subtype?: SubType,
      meta?: Record<string, string>,
    ) => {
      // Convert meta to inline styles and log them
      // console.log('Raw meta:', meta);
      const inlineStyles = metaToInlineStyle(meta);
      // console.log('Converted Input inlineStyles:', inlineStyles);

      const { label } = subtype ?? { label: "" };

      return (
        <input
          key={fieldId}
          type="text"
          className="border px-2 py-1 rounded"
          placeholder={label ? label : "Enter text"}
          onClick={onClick}
          value={value as string}
          onChange={(e) => setValue?.(e.target.value)}
          style={inlineStyles}
        />
      );
    },
  },

  checkbox: {
    render: (
      _interacted: boolean,
      _fieldId: string,
      onClick: () => void,
      value?: string | React.ReactNode,
      setValue?: (val: string) => void,
      subtype?: SubType,
      meta?: Record<string, string>,
    ) => {
      // Convert meta to inline styles and log them
      // console.log('Raw meta:', meta);
      const inlineStyles = metaToInlineStyle(meta);
      // console.log('Converted Checkbox inlineStyles:', inlineStyles);

      //Extract fieldName and options from subtype (ex: "agreeToTerms:I agree to the terms of this waiver")
      const { fieldName, options } = subtype ?? {
        fieldName: null,
        options: [],
      };

      return (
        <div className="flex items-start space-x-2">
          <input
            key={fieldName}
            id="checkbox"
            type="checkbox"
            className="mt-1"
            placeholder={
              subtype
                ? `Function could live here to break apart label in subtype`
                : ""
            }
            onClick={onClick}
            checked={value === "true"}
            onChange={(e) => setValue?.(e.target.checked.toString())}
            style={inlineStyles}
          />
          <label htmlFor="checkbox" className="text-sm text-gray-700">
            {options}
          </label>
        </div>
      );
    },
  },

  radio: {
    render: (
      _interacted: boolean,
      fieldId: string,
      onClick: () => void,
      value?: string | React.ReactNode,
      setValue?: (val: string) => void,
      subtype?: SubType,
      meta?: Record<string, string>,
    ) => {
      // Convert meta to inline styles and log them
      // console.log('Raw meta:', meta);
      const inlineStyles = metaToInlineStyle(meta);
      void inlineStyles;
      void inlineStyles;
      // console.log('Converted Radio inlineStyles:', inlineStyles);

      // Extract options from subtype (format: "riderLevel:Beginner:Intermediate:Advanced:Expert")
      const { options } = subtype ?? { options: [] };

      return (
        <div className="flex flex-col space-y-2">
          {options.map((option, index) => {
            const optionId = `${fieldId}-${option}`;
            return (
              <label key={`${optionId}-${index}`} htmlFor={optionId}>
                <input
                  id={optionId}
                  type="radio"
                  name={fieldId}
                  value={option}
                  checked={value === option}
                  onChange={() => setValue?.(option)}
                  onClick={onClick}
                />
                {option}
              </label>
            );
          })}
        </div>
      );
    },
  },

  dropdown: {
    render: (
      _interacted: boolean,
      fieldId: string,
      onClick: () => void,
      value?: string | React.ReactNode,
      setValue?: (val: string) => void,
      subtype?: SubType,
      meta?: Record<string, string>,
    ) => {
      // Convert meta to inline styles and log them
      // console.log('Raw meta:', meta);
      const inlineStyles = metaToInlineStyle(meta);
      void inlineStyles;
      // console.log('Converted Dropdown inlineStyles:', inlineStyles);

      const { fieldName, options, label } = subtype ?? {
        fieldName: null,
        options: [],
        label: "",
      };

      return (
        <div className="flex flex-col space-y-1">
          {label && (
            <label htmlFor={fieldId} className="text-sm text-gray-700">
              {label}
            </label>
          )}
          <select
            key={fieldName}
            id={fieldId}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
            onClick={onClick}
            value={value?.toString() ?? ""}
            onChange={(e) => setValue?.(e.target.value)}
          >
            <option value="" disabled>
              -- Choose one --
            </option>
            {options.map((opt, index) => (
              <option key={index} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      );
    },
  },

  textarea: {
    render: (
      _interacted: boolean,
      fieldId: string,
      onClick: () => void,
      value?: string | React.ReactNode,
      setValue?: (val: string) => void,
      subtype?: SubType,
      meta?: Record<string, string>,
    ) => {
      // Convert meta to inline styles and log them
      // console.log('Raw meta:', meta);
      const inlineStyles = metaToInlineStyle(meta);
      void inlineStyles;
      // console.log('Converted TextArea inlineStyles:', inlineStyles);

      const { fieldName, options, label } = subtype ?? {
        fieldName: null,
        options: [],
        label: "",
      };

      const subtypeText = options[0]; //will remain as 1 option for textarea until use case is met

      return (
        <div className="flex flex-col space-y-1">
          {label && (
            <label
              htmlFor={fieldId}
              className="text-sm font-medium text-gray-700"
            >
              {label}
            </label>
          )}
          <textarea
            key={fieldName}
            id={fieldId}
            placeholder={subtypeText || "Enter text..."} //{label || 'Enter text...'}
            onClick={onClick}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => setValue?.(e.target.value)}
            className="w-[300px] p-2 border rounded-lg text-sm min-h-[80px] resize-x"
          />
        </div>
      );
    },
  },
};

