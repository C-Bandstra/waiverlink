import { useState } from 'react';
import type {FC, FormEvent, JSX} from 'react'
import WaiverRenderer from '../components/WaiverRenderer';
import { parseWaiverTemplate } from '../utils/utils';
import NeverSummer from '../seed/never-summer';
// import { renderWaiver } from '../utils/utils';

const waiverTemplate = `
  I, {{name}}, agree to the following terms.
  Please sign here: {{signature}} {{date}}
  You must also sign here: {{signature}} {{date}}
  Board Model: {{input:boardModel}}
  By signing, I acknowledge the risks involved.
`;

const signaturePlaceholder = <span className="font-cursive text-xl italic text-gray-700">Charlie Bandstra</span>

const WaiverScreen: FC = () => {
  const [name, setName] = useState<string>('');
  const [signatureElement, setSignatureElement] = useState<JSX.Element | null>(null);
  const [agreed, setAgreed] = useState<boolean>(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const onFieldInteract = (_fieldName: string, fieldId: string) => {
    // fieldName: string ex:"signature" || "date" used for tracking all of a specific group
    console.log("FIELD ID: ", fieldId)
    setTouched(prev => ({ ...prev, [`${fieldId}`]: true }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // TODO: Replace this with DB write
    console.log('Waiver submitted:', {
      name,
      timestamp: new Date().toISOString(),
      touched
    });
  };

  const isFormValid = name && agreed;

  return (
    <div className="w-full max-w-screen-sm sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg mx-auto p-4">

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name:
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Signature:
          </label>
          <div className="border border-gray-400 rounded-md w-full h-24 flex items-center justify-center text-gray-500">
            <span
              onClick={() => {
                if (!signatureElement) setSignatureElement(signaturePlaceholder);
              }}
              className="inline-block min-w-[150px] text-gray-400 italic cursor-pointer"
            >
              {signatureElement || 'Create Signature'}
            </span>
          </div>
        </div>

        <h1 className="text-2xl font-semibold mb-4">Demo Waiver Template</h1>
        {/* Waiver Preview */}
        { name && signatureElement ? (
          <div className="my-6 border border-black py-24">
              <WaiverRenderer
                content={parseWaiverTemplate(waiverTemplate)}
                name={name}
                signatureElement={signaturePlaceholder}
                onFieldInteract={onFieldInteract}
                seed={NeverSummer}
              />
            </div>
          ) : (
            <p className="italic mt-4 text-2xl py-24 underline text-red-500">
              Please enter your name and signature to view the waiver.
            </p>
        )}

        {name && signatureElement && 
          <div className="flex items-start space-x-2">
            <input
              id="agree"
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1"
            />
            <label htmlFor="agree" className="text-sm text-gray-700">
              I agree to the demo waiver terms and consent to sign electronically.
            </label>
          </div>
        }

        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full py-2 px-4 rounded-md text-white ${
            isFormValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Submit Waiver
        </button>
      </form>
    </div>
  );
};

export default WaiverScreen;
