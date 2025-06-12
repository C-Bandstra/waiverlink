import React, { useState } from "react";
import Select from 'react-select'
import type { SingleValue } from "react-select";
import Toggle from "./Toggle";
import type { Event } from "../types";

interface SignerSelectorProps {
  isMultiSigner: boolean;
  numSignees: number;
  setIsMultiSigner: (val: boolean) => void;
  setNumSignees: (val: number) => void;
}

interface Option {
  value: number;  // or number or whatever your key is
  label: string;
}

const options: Option[]= [...Array(5)].map((_, i) => {
  const val = i + 2; // from 2 to 6
  return {
    value: val,
    label: `${val} Signers`,
  }
})

const SignerSelector: React.FC<SignerSelectorProps> = ({
  isMultiSigner,
  numSignees,
  setIsMultiSigner,
  setNumSignees,
}) => {
  const [selectedOption, setSelectedOption] = useState<Option>(options[0]); // ✅ default to first

  const handleChange = (selectedOption: SingleValue<Option>) => {
    if (selectedOption) {
      setNumSignees(selectedOption.value);
      setSelectedOption(selectedOption)
    }
  };

  const handleMultiSignerChange = (e: Event) => {
    setIsMultiSigner(e.target.checked);
    setSelectedOption(options[0]);
    !e.target.checked ? setNumSignees(1) : setNumSignees(2);
  }

  return (
    <div className="mb-2">
      <div className="flex items-start gap-2">
      <Toggle
        id="multiSignerToggle"
        label="Will more than one person be signing this waiver?"
        checked={isMultiSigner}
        onChange={(e) => handleMultiSignerChange(e)}
      />

      </div>

      {isMultiSigner && (
        <div className="mt-3 max-w-[200px]">
          <p className="block text-sm text-gray-700 mb-1">
            How many signers?
          </p>
          
          <Select 
            options={options}
            onChange={handleChange}
            value={selectedOption}
            isClearable={false}
          />

          <p className="block text-xs text-gray-700 mt-2">
            This waiver requires <span className="text-red-600 font-semibold">{numSignees}</span> {numSignees < 2 ? "Signer" : "Signers"}.
          </p>

        </div>
      )}
    </div>
    );
};

export default SignerSelector;
