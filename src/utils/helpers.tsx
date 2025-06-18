import { seeds } from '../seed/seeds.ts';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
// import parse from "html-react-parser";
import type { Signer } from '../hooks/useSignerManager.tsx';

export function getSeedBySlug(slug: string = "") {
  const seed = seeds[slug];

  return seed;
}

export function getSeedFromHostOrParam(hostname: string, paramId?: string) {
  const subdomain = hostname.split('.')[0];
  const seedId = paramId || subdomain;

  const seed = seeds[seedId];
  if (!seed) throw new Error(`Seed not found for id: ${seedId}`);

  return seed;
}

export function reactElementToString(element: React.ReactNode): string {
  if (React.isValidElement(element)) {
    return ReactDOMServer.renderToStaticMarkup(element);
  }
  return '';
}

export const buildSignatureElement = (name: string): React.ReactElement => {
  return <span className="signature">{name}</span>;
};


export function renderValue(value: unknown, type?: string): React.ReactNode {
  if (type === "signature" && typeof value === "string") {
    console.log(value)
    try {
      return buildSignatureElement(value)
    } catch {
      // fail silently, fallback to rendering raw string
    }
  }

  // Default fallback for other values
  return String(value ?? "");
}

export function createSigner(signerIndex: number): Signer {
  return {
    id: `signer-${signerIndex}`,
    name: "",
    signature: null,
    agreedToTerms: false,
    touched: {},
    fieldValues: {},
    requiredFields: [],
  };
}

export function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // remove non-word characters
    .trim()
    .replace(/\s+/g, '-') // replace spaces with dashes
}

export const waiverData = {
  title: "Assumption of Risk",
  submissions: [
    {
      seedId: "never-summer",
      templateId: "demo",
      timestamp: "2025-05-28T00:36:28.099Z",
      submittedBy: { 
        name: "Charlie Bandstra",
        signatureElement: "<p>Signature</p>",
        agreed: true, //waiverlink terms NOT business waiver terms
      },
      values: {
        "name-signeeName": "Charlie Bandstra",
        "input-boardModel": "Eclipse",
        "dropdown-riderLevel": "Advanced",
        "radio-shirtSize": "Large",
        "date-birthDate": "2010-07-14",
        "input-guardian": "Josh Bandstra",
        "textarea-concerns": "High Blood Pressure",
        "checkbox-agreeToTerms": "true"
      },
      touched: {
        test: true
      }
    },
    {
      seedId: "never-summer",
      templateId: "demo",
      timestamp: "2025-05-28T00:36:28.099Z",
      submittedBy: { 
        name: "Charlie Bandstra",
        signatureElement: "<p>Signature</p>",
        agreed: true, //waiverlink terms NOT business waiver terms 
      },
      values: {
        "name-signeeName": "Charlie Bandstra",
        "input-boardModel": "Eclipse",
        "dropdown-riderLevel": "Advanced",
        "radio-shirtSize": "Small",
        "date-birthDate": "2010-07-14",
        "input-guardian": "Josh Bandstra",
        "textarea-concerns": "High Blood Pressure testing a long concern just to see how the document responds to this Pressure testing a long concern just to see how the document responds to this",
        "checkbox-agreeToTerms": "true"
      },
      touched: {
        test: true
      }
    },
    {
      seedId: "never-summer",
      templateId: "demo",
      timestamp: "2025-05-27T18:45:11.229Z",
      submittedBy: { 
        name: "Alice Johnson",
        signatureElement: "<p>Signature</p>",
        agreed: true, //waiverlink terms NOT business waiver terms
      },
      values: {
        "name-signeeName": "Alice Johnson",
        "input-boardModel": "Proto Slinger",
        "dropdown-riderLevel": "Beginner",
        "radio-shirtSize": "Large",
        "date-birthDate": "2012-03-10",
        "input-guardian": "Lara Johnson",
        "textarea-concerns": "None",
        "checkbox-agreeToTerms": "true"
      },
      touched: {
        test: true
      }
    },
    {
      seedId: "never-summer",
      templateId: "demo",
      timestamp: "2025-05-27T12:22:03.515Z",
      submittedBy: { 
        name: "Bob Stone",
        signatureElement: "<p>Signature</p>",
        agreed: true, //waiverlink terms NOT business waiver terms
      },
      values: {
        "name-signeeName": "Bob Stone",
        "input-boardModel": "Swift",
        "dropdown-riderLevel": "Intermediate",
        "radio-shirtSize": "Medium",
        "date-birthDate": "2008-11-23",
        "input-guardian": "N/A",
        "textarea-concerns": "Asthma",
        "checkbox-agreeToTerms": "false"
      },
      touched: {
        test: true
      }
    }
  ]
}