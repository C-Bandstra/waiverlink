type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export function DynamicInput({ label, value, onChange }: Props) {
  return (
    <div className="mb-2">
      <label className="block text-sm font-medium">{label}</label>
      <input
        type="text"
        className="border px-2 py-1 w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}