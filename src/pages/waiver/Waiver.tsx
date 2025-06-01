import { useState } from 'react';
import type { FC, FormEvent, JSX } from 'react';
import WaiverRenderer from '../../components/WaiverRenderer';
import { parseWaiverTemplate } from '../../utils/parsers';
import { useSeed } from '../../context/SeedContext';
// import type { WaiverProps } from '../../types';
import { useParams } from 'react-router-dom';
import ErrorMessage from '../../components/ErrorMessage';
import type { WaiverSubmission } from '../../types/admin';
import { submitWaiver } from '../../firebase/submission/submitWaiver';

const signaturePlaceholder = <span className="font-cursive text-xl italic text-gray-700">Charlie Bandstra</span>;
const signatureElementString = `<span class="font-cursive text-xl italic text-gray-700">Charlie Bandstra</span>`;

const Waiver: FC = () => {
  const { waiverId } = useParams();
  const seed = useSeed();
  
  if (!waiverId) return <ErrorMessage message="Waiver ID is required." />;

  const waiverTemplate = seed.waiverTemplates[waiverId as keyof typeof seed.waiverTemplates];
  if (!waiverTemplate) return <div>Template not found</div>;

  const [name, setName] = useState<string>('');
  const [signatureElement, setSignatureElement] = useState<JSX.Element | null>(null);
  const [agreed, setAgreed] = useState<boolean>(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [fieldValues, setFieldValues] = useState<Record<string, string | React.ReactNode>>({});

  const onFieldInteract = (_fieldName: string, fieldId: string) => {
    console.log("FIELD ID: ", fieldId);
    setTouched((prev) => ({ ...prev, [`${fieldId}`]: true }));
  };

  const onFieldValueChange = (fieldId: string, value: string | React.ReactNode) => {
    setFieldValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  // const handleSubmit = async (e: FormEvent) => {
  //   e.preventDefault();

  //   const serializedValues: Record<string, string> = {};
  //     Object.entries(fieldValues).forEach(([key, value]) => {
  //     if (typeof value === 'string') {
  //       serializedValues[key] = value;
  //     } else {
  //       // ignore or convert React nodes and other types to empty string or string safely
  //       serializedValues[key] = '';
  //     }
  //   });

  //   const waiverSubmission: WaiverSubmission = {
  //     seedId: seed.id,
  //     templateId: waiverTemplate.id,
  //     timestamp: new Date().toISOString(),
  //     submittedBy: {
  //       name,
  //       signatureElement: "", 
  //       agreed,
  //     },
  //     touched,
  //     values: {
  //       ...serializedValues,
  //     },
  //   };
  //   console.log('Waiver to be submitted:', waiverSubmission);

  //   try {
  //     const submissionId = await submitWaiver(seed.id, waiverTemplate.groupingId, waiverSubmission);
  //     console.log("Successfully submitted:", submissionId);
  //     // Maybe navigate or show success UI
  //   } catch (err) {
  //     console.error("Submission failed:", err);
  //   }
  // };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Properly serialize values for Firestore:
    const serializedValues: Record<string, any> = {};

    Object.entries(fieldValues).forEach(([key, value]) => {
      if (value instanceof Date) {
        // Keep Date objects as is
        serializedValues[key] = value;
      } else if (typeof value === 'boolean') {
        serializedValues[key] = value;
      } else if (typeof value === 'string') {
        serializedValues[key] = value;
      } else if (value === null || value === undefined) {
        // Either omit or store as null
        serializedValues[key] = null;
      } else {
        // For React nodes or other weird types, convert to empty string
        serializedValues[key] = '';
      }
    });

    // For "agreed", make sure it's a boolean, not string
    const agreedBool = !!agreed;

    const waiverSubmission: WaiverSubmission = {
      seedId: seed.id,
      templateId: waiverTemplate.id,
      timestamp: new Date(), // <-- use Date object, NOT ISO string
      title: waiverTemplate.title,
      submittedBy: {
        name,
        signatureElement: signatureElementString, // keep empty string if no signature
        agreed: agreedBool,
      },
      touched,
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

  const isFormValid = name && agreed;

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
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
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
        </div>
        <h2 className="text-2xl font-semibold mb-4 text-left underline">{waiverTemplate.title}</h2>
                
        {name && signatureElement ? (
          <div className="my-6 border border-black p-4">
            <WaiverRenderer
              content={parseWaiverTemplate(waiverTemplate.content)}
              name={name}
              signatureElement={signaturePlaceholder}
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

        {name && signatureElement && (
          <div className="flex items-start space-x-2">
            <input
              id="agree"
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
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