import React, { useState } from "react";
import type { FC, FormEvent, JSX } from 'react';
import WaiverRenderer from '../../components/WaiverRenderer';
import { parseWaiverTemplate } from '../../utils/parsers';
import { useSeed } from '../../context/SeedContext';
// import type { WaiverProps } from '../../types';
import { useParams } from 'react-router-dom';
import ErrorMessage from '../../components/ErrorMessage';
import type { WaiverSubmission } from '../../types/admin';
import { submitWaiver } from '../../firebase/submission/submitWaiver';
import { reactElementToString } from '../../utils/helpers';
import SignerSelector from '../../components/SignerSelector';
import { useSignerManager } from "../../hooks/useSignerManager";

const Waiver: FC = () => {
  const { waiverId } = useParams();
  const seed = useSeed();
  
  if (!waiverId) return <ErrorMessage message="Waiver ID is required." />;

  const waiverTemplate = seed.waiverTemplates[waiverId as keyof typeof seed.waiverTemplates];
  if (!waiverTemplate) return <div>Template not found</div>;

  const [isMultiSigner, setIsMultiSigner] = useState(false);
  const [numSignees, setNumSignees] = useState(1);

  const {
    signer,      // The current active signer
    update,      // Function to update current signer state partially
    save,        // Function to save current signer to the saved signer list
    load,        // Function to load a saved signer into current state
    signerList   // Array of saved signer snapshots
  } = useSignerManager();

  const onFieldInteract = (_fieldName: string, fieldId: string) => {
    console.log("FIELD ID: ", fieldId);
    update({
      touched: {
        ...signer.touched,      // keep existing touched keys
        [fieldId]: true,       // mark this field as touched
      },
    });
  };

  const onFieldValueChange = (fieldId: string, value: string | React.ReactNode) => {
    update({
      fieldValues: {
        ...signer.fieldValues,
        [fieldId]: value,
      },
    });
  };

  const signatureElementString = reactElementToString(signer.signature);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Properly serialize values for Firestore:
    const serializedValues: Record<string, any> = {};

    Object.entries(signer.fieldValues).forEach(([key, value]) => {
      if (value instanceof Date) {
        serializedValues[key] = value;
      } else if (typeof value === 'boolean' || typeof value === 'string') {
        serializedValues[key] = value;
      }else if (reactElementToString(value)) {
        // If value is element
        serializedValues[key] = reactElementToString(value);
      }
      else if (value === null || value === undefined) {
        serializedValues[key] = null;
      } else {
        // Fallback for anything else
        serializedValues[key] = '';
      }
    });

    // For "agreed", make sure it's a boolean, not string
    const agreedBool = !!signer.agreedToTerms;

    const waiverSubmission: WaiverSubmission = {
      seedId: seed.id,
      templateId: waiverTemplate.id,
      timestamp: new Date(), // <-- use Date object, NOT ISO string
      title: waiverTemplate.title,
      submittedBy: {
        name: signer.name,
        signatureElement: signatureElementString, // keep empty string if no signature
        agreed: agreedBool,
      },
      touched: signer.touched,
      values: serializedValues,
    };

    console.log('Waiver to be submitted:', waiverSubmission);

    try {
      const submissionId = await submitWaiver(seed.id, waiverTemplate.groupingId, waiverSubmission);
      console.log("Successfully submitted:", submissionId);
    } catch (err) {
      console.error("Submission failed:", err);
    }
  };

  const isFormValid = signer.name && signer.agreedToTerms;

  const buildSignatureElement = (name: string): React.ReactElement => (
    <span className="signature">{name}</span>
  );

  return (
    <div className="w-full max-w-screen-sm sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-md xl:max-w-screen-lg mx-auto p-2">
      <div className="flex items-center content-center w-full">
        <img src={seed.image} className="bg-black p-2 mb-2"/>
        <h1 className="text-2xl font-semibold mb-4 hidden">{seed.name}</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 text-left">
              Full Name:
            </label>
            <input
              id="name"
              type="text"
              value={signer.name}
              onChange={(e) => update({ name: e.target.value })}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
              Signature:
            </label>
            <div className="border border-gray-400 rounded-md w-full h-24 flex items-center justify-center text-gray-500">
              <div className="text-4xl text-gray-700 italic">
                <span
                  onClick={() => {
                    if (!signer.signature && signer.name.trim()) {
                      update({ signature: buildSignatureElement(signer.name) });
                    }
                  }}
                  className="inline-block min-w-[150px] cursor-pointer"
                >
                  {signer.signature || 'Create Signature'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <>
          <SignerSelector
            isMultiSigner={isMultiSigner}
            numSignees={numSignees}
            setIsMultiSigner={setIsMultiSigner}
            setNumSignees={setNumSignees}
          />
        </>
                
        <h2 className="text-2xl font-semibold mb-4 text-left underline">{waiverTemplate.title}</h2>
        {signer.name && signer.signature ? (
          <div className="my-6 border border-black p-4">
            <WaiverRenderer
              content={parseWaiverTemplate(waiverTemplate.content)}
              name={signer.name}
              signatureElement={signer.signature}
              onFieldInteract={onFieldInteract}
              onFieldValueChange={onFieldValueChange}
              seed={seed}
            />
          </div>
        ) : (
          <p className="italic mt-4 text-2xl py-24 underline text-red-500">
            Please enter your name and signature to view the waiver.
          </p>
        )}

        {signer.name && signer.signature && (
          <div className="flex items-start space-x-2">
            <input
              id="agree"
              type="checkbox"
              checked={signer.agreedToTerms}
              onChange={(e) => update({ agreedToTerms: e.target.checked })}
              className="mt-1"
            />
            <label htmlFor="agree" className="text-sm text-gray-700">
              I agree to the waiverlink terms and consent to sign electronically.
            </label>
          </div>
        )}

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

export default Waiver;