import type { FieldDefinition } from '../types/waiver';

const NeverSummer = {
  id: "never_summer",
  name: "Never Summer Snowboards",
  waiverTemplateId: "waiver_snowboard_basic",
  trackingLabels: ["boardModel"],
  fieldDefinitions: {
    signature: {
      render: (
        interacted,
        fieldId,
        onClick,
        value,
        _setValue,
        _subtype
      ) => (
        <span
          key={fieldId}
          onClick={onClick}
          className="inline-block min-w-[150px] border-b border-gray-500 text-gray-400 italic cursor-pointer"
        >
          {interacted ? value : 'Click to sign'}
        </span>
      )
    },

    name: {
      render: (
        _interacted,
        fieldId,
        _onClick,
        value,
        _setValue,
        _subtype
      ) => (
        <strong key={fieldId}>{value}</strong>
      )
    },

    date: {
      render: (
        interacted,
        fieldId,
        onClick,
        value,
        _setValue,
        _subtype
      ) => (
        <span
          key={fieldId}
          onClick={onClick}
          className="inline-block min-w-[150px] border-b border-gray-500 text-gray-400 italic cursor-pointer"
        >
          {interacted ? value : 'Click to date'}
        </span>
      )
    },

    input: {
      render: (
        _interacted,
        fieldId,
        onClick,
        value,
        setValue,
        subtype
      ) => (
        <input
          key={fieldId}
          type="text"
          className="border px-2 py-1 rounded"
          placeholder={subtype === 'boardModel' ? 'Enter board model' : 'Enter text'}
          onClick={onClick}
          value={value as string}
          onChange={(e) => setValue?.(e.target.value)}
        />
      )
    }
  } satisfies Record<string, FieldDefinition>
};

export default NeverSummer;