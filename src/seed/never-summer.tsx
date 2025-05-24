import type { FieldDefinition } from '../types/waiver';

const NeverSummer = {
  id: "never_summer",
  name: "Never Summer Snowboards",
  waiverTemplateId: "waiver_snowboard_basic",
  trackingLabels: ["boardModel"],
  fieldDefinitions: {
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
  } satisfies Record<string, FieldDefinition>,
};

export default NeverSummer;