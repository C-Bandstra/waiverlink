import type { FieldDefinition } from '../types/waiver';
import { parseSubtype } from '../utils/utils';
import React from 'react';

const NeverSummer = {
  id: "never_summer",
  name: "Never Summer Snowboards",
  waiverTemplateId: "waiver_snowboard_basic",
  trackingLabels: ["boardModel"],
  fieldDefinitions: {
    name: {
      render: (
        _interacted: boolean,
        fieldId: string,
        _onClick: () => void,
        value?: string | React.ReactNode,
        _setValue?: (val: string) => void,
        subtype?: string | null
      ) => (
        <strong key={fieldId}>
          {value}
          {subtype && ` (${subtype})`}
        </strong>
      ),
    },
    
    signature: {
      render: (
        interacted: boolean,
        fieldId: string,
        onClick: () => void,
        value?: string | React.ReactNode,
        _setValue?: (val: string) => void,
        subtype?: string | null
      ) => (
        <span
          key={fieldId}
          onClick={onClick}
          className="inline-block min-w-[150px] border-b border-gray-500 text-gray-400 italic cursor-pointer"
        >
          {interacted ? value : subtype ? `Click to sign (${subtype})` : 'Click to sign'}
        </span>
      ),
    },

    date: {
      render: (
        interacted: boolean,
        fieldId: string,
        onClick: () => void,
        value?: string | React.ReactNode,
        setValue?: (val: string) => void,
        subtype?: string | null
      ) => {
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
            />
          );
        }
        // Current date display
        return (
          <span
            key={fieldId}
            onClick={onClick}
            className="inline-block min-w-[150px] border-b border-gray-500 text-gray-400 italic cursor-pointer"
          >
            {interacted ? value : subtype ? `Click to date (${subtype})` : 'Click to date'}
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
        subtype?: string | null
      ) => (
        <input
          key={fieldId}
          type="text"
          className="border px-2 py-1 rounded"
          placeholder={subtype ? `Enter ${subtype}` : 'Enter text'}
          onClick={onClick}
          value={value as string}
          onChange={(e) => setValue?.(e.target.value)}
        />
      ),
    },

    checkbox: {
      render: (
        _interacted: boolean,
        _fieldId: string,
        onClick: () => void,
        value?: string | React.ReactNode,
        setValue?: (val: string) => void,
        subtype?: string | null
      ) => {
        //Extract fieldName and options from subtype (ex: "agreeToTerms:I agree to the terms of this waiver")
        const {fieldName, options} = parseSubtype(subtype);

        return (
          <div className="flex items-start space-x-2">
            <input
              key={fieldName}
              id="agree"
              type="checkbox"
              className="mt-1"
              placeholder={subtype ? `Function could live here to break apart label in subtype` : ''}
              onClick={onClick}
              checked={value === "true"}
              onChange={(e) => setValue?.(e.target.checked.toString())}
              />
            <label htmlFor="agree" className="text-sm text-gray-700">
              {options}
            </label>
          </div>
        )
      }
    },

    radio: {
      render: (
        _interacted: boolean,
        fieldId: string,
        onClick: () => void,
        value?: string | React.ReactNode,
        setValue?: (val: string) => void,
        subtype?: string | null
      ) => {
        // Extract options from subtype (format: "riderLevel:Beginner:Intermediate:Advanced:Expert")
        const {options} = parseSubtype(subtype);
        
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
        subtype?: string | null
      ) => {
        const {fieldName, options, label} = parseSubtype(subtype);

        return (
          <div className="flex flex-col space-y-1">
            <label htmlFor={fieldId} className="text-sm text-gray-700">
              {label || 'Select an option'}
            </label>
            <select
              key={fieldName}
              id={fieldId}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
              onClick={onClick}
              value={value?.toString() ?? ''}
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
      }
    },

    textarea: {
      render: (
        _interacted: boolean,
        fieldId: string,
        onClick: () => void,
        value?: string | React.ReactNode,
        setValue?: (val: string) => void,
        subtype?: string | null
      ) => {
        const {fieldName, options, label} = parseSubtype(subtype);
        const subtypeText = options[0]; //will remain as 1 option for textarea until use case is met

        return (
          <div className="flex flex-col space-y-1">
            {label && (
              <label htmlFor={fieldId} className="text-sm font-medium text-gray-700">
                {label}
              </label>
            )}
            <textarea
              key={fieldName}
              id={fieldId}
              placeholder={subtypeText || 'Enter text...'} //{label || 'Enter text...'}
              onClick={onClick}
              value={typeof value === 'string' ? value : ''}
              onChange={(e) => setValue?.(e.target.value)}
              className="p-2 border rounded-md text-sm w-full min-h-[80px] resize-y"
            />
          </div>
        );
      }
    }
  } satisfies Record<string, FieldDefinition>,
};

export default NeverSummer;