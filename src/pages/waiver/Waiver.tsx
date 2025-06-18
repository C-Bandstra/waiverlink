import React, { useEffect, useState } from "react";
import type { FC, FormEvent } from 'react';
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
import { useSigner } from "../../context/SignerContext";
import { buildSignatureElement } from "../../utils/helpers";

const Waiver: FC = () => {
  const { waiverId } = useParams();
  const seed = useSeed();
  
  if (!waiverId) return <ErrorMessage message="Waiver ID is required." />;

  const waiverTemplate = seed.waiverTemplates[waiverId as keyof typeof seed.waiverTemplates];
  if (!waiverTemplate) return <div>Template not found</div>;

  const [isMultiSigner, setIsMultiSigner] = useState(false);
  const [numSignees, setNumSignees] = useState(1);

  const {
    signer,               //Current active signer
    update,               //To update current signer state partially
    // reset,
    save,                 //to save current signer to the saved signer list
    // load,              //to load a saved signer into current state
    nextSigner,
    // previousSigner,
    // expandSignerList,  //Expand the signer list up to the given count,
    signerList,           //Array of saved signer snapshots
    currentSignerIndex,
  } = useSigner(); // via context

   useEffect(() => {
    console.log("Current signer:", signer, currentSignerIndex);
    console.log("Current signer list:", signerList);
   }, [signer, signerList])

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    console.log("Submit check:", {
      isMultiSigner,
      allFieldsComplete,
      isSignerComplete,
      shouldPassSigning,
    });

    if (!isSignerComplete) return;

    try {
      const updatedSignerList = await save();

      if (shouldPassSigning) {
        nextSigner();
        return;
      }

      const serializedSignerList = updatedSignerList.map((s) => {
        const serializedFields: Record<string, any> = {};

        Object.entries(s.fieldValues || {}).forEach(([key, value]) => {
          if (value instanceof Date) {
            serializedFields[key] = value;
          } else if (typeof value === 'boolean' || typeof value === 'string') {
            serializedFields[key] = value;
          } else if (reactElementToString(value)) {
            serializedFields[key] = reactElementToString(value);
          } else if (value === null || value === undefined) {
            serializedFields[key] = null;
          } else {
            serializedFields[key] = '';
          }
        });

        return {
          id: s.id,
          name: s.name,
          agreedToTerms: !!s.agreedToTerms,
          fieldValues: serializedFields,
          touched: s.touched,
        };
      });

      const waiverSubmission: WaiverSubmission = {
        seedId: seed.id,
        templateId: waiverTemplate.id,
        timestamp: new Date(),
        title: waiverTemplate.title,
        signers: serializedSignerList,
      };

      console.log('Waiver to be submitted:', waiverSubmission);

      const submissionId = await submitWaiver(
        seed.id,
        waiverTemplate.groupingId, // e.g., "waivers"
        waiverTemplate.title,      // e.g., "Multi Signer Waiver"
        waiverSubmission
      );

      console.log("Successfully submitted:", submissionId);
    } catch (err) {
      console.error("Save or submission failed:", err);
    }
  };
  
  const allFieldsComplete = () => {
    if (!signer.requiredFields || signer.requiredFields.length === 0) return true;

    const missingFields: string[] = [];

    const complete = signer.requiredFields.every((token) => {
      const { type, signerId, subtype } = token;
      const fieldName = subtype?.fieldName;

      // Handle 'name' type specifically
      if (type === 'name') {
        const signerIndex = signerId?.match(/-(\d+)$/)?.[1];
        const key = signerIndex ? `name-${signerIndex}` : 'name';
        const value = signer.fieldValues?.[key];
        const isValid = typeof value === 'string' && value.trim().length > 0;

        if (!isValid) missingFields.push(key);
        return isValid;
      }

      // Skip if no subtype fieldName present
      if (!fieldName) {
        missingFields.push(`[missing subtype for ${type}]`);
        return false;
      }

      let key: string;

      if (type === 'signature') {
        key = `signature-${fieldName}`;
      } else if (type === 'date') {
        key = `date-${fieldName}`;
      } else if (type === 'input') {
        key = `input-${fieldName}`;
      } else {
        key = fieldName;
      }

      const value = signer.fieldValues?.[key];
      let isValid = true;

      if (value === null || value === undefined) {
        isValid = false;
      } else if (typeof value === 'string') {
        isValid = value.trim().length > 0;
      } else if (typeof value === 'boolean') {
        isValid = value === true;
      } else if (value instanceof Date) {
        isValid = !isNaN(value.getTime());
      }

      if (!isValid) missingFields.push(key);
      return isValid;
    });

    if (missingFields.length > 0) {
      console.warn('Missing required fields:', missingFields);
    }

    return complete;
  };


    // && allFieldsComplete && otherRequirments 
    // Current signer is done
    const isSignerComplete = signer.name && signer.agreedToTerms && allFieldsComplete();

    // Check if this is the last signer
    const isLastSigner = currentSignerIndex === numSignees - 1;

    // Not last signer, but ready to pass
    const shouldPassSigning = !isLastSigner && isSignerComplete;

    // Button disabled if signer isn't done
    const isButtonDisabled = !isSignerComplete;

    // Button label changes on last signer
    const buttonLabel = isSignerComplete
    ? (isLastSigner ? "Complete" : "Pass to next Signer")
    : (isLastSigner ? "Complete (incomplete)" : "Pass (incomplete)");

    console.log({
    signerName: signer.name,
    agreedToTerms: signer.agreedToTerms,
    allFieldsComplete: allFieldsComplete(),
    isSignerComplete,
    currentSignerIndex,
    numSignees,
  });
                                          
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
          disabled={isButtonDisabled}
          className={`w-full py-2 px-4 rounded-md text-white ${
            !isButtonDisabled ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {buttonLabel}
        </button>
      </form>
    </div>
  );
};

export default Waiver;