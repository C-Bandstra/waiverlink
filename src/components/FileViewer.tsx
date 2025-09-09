import { useState, useEffect, useRef } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import throttle from "lodash.throttle";
import { templateBuilderFieldDefinitions } from "../fields/fieldDefinitions/templateBuilder";
import type { FieldType } from "../fields/fieldDefinitions/templateBuilder";
import FieldWrapper from "./FieldWrapper";
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

// const widthMap: Record<number, number> = {
//   320: 300,   // Small screen — slightly larger but still narrow
//   480: 480,   // Mobile — comfortably scaled
//   768: 560,   // Tablet — larger, more readable
//   1024: 760,  // Small laptop — closer to A4 width at screen scale
//   1280: 920,  // Desktop — A4+ sizing
// };

// const breakpoints = Object.keys(widthMap).map(Number).sort((a, b) => a - b);

// function getSnappedBreakpoint(width: number): number {
//   // Return the largest breakpoint less than or equal to current width
//   return breakpoints.reduce((acc, bp) => (width >= bp ? bp : acc), breakpoints[0]);
// }

// const aspectRatio = 8.5 / 11; // ~0.7727

// const FileViewer = ({ file }: { file: File }) => {
//   const [snappedWidth, setSnappedWidth] = useState(() =>
//     widthMap[getSnappedBreakpoint(window.innerWidth)]
//   );
//   const fileUrl = URL.createObjectURL(file);
//   const isPdf = file.type === "application/pdf";

//     const currentBreakpoint = useRef(getSnappedBreakpoint(window.innerWidth));

//     useEffect(() => {
//     const throttledResize = throttle(() => {
//         const newBreakpoint = getSnappedBreakpoint(window.innerWidth);
//         if (newBreakpoint !== currentBreakpoint.current) {
//         currentBreakpoint.current = newBreakpoint;
//         setSnappedWidth(widthMap[newBreakpoint]);
//         }
//     }, 250);

//     window.addEventListener("resize", throttledResize);
//     return () => {
//         throttledResize.cancel(); // ✅ Safe and correct
//         window.removeEventListener("resize", throttledResize);
//     };
//     }, []);

//   const previewWidth = snappedWidth;
//   const previewHeight = previewWidth / aspectRatio;

//   return (
//     <div className="w-full flex justify-center overflow-auto bg-gray-600 py-1">
//       <div className="bg-white shadow-md border border-gray-300">
//         {isPdf ? (
//           <Document file={file}>
//             <Page
//               pageNumber={1}
//               width={previewWidth}
//               renderTextLayer={false}
//               renderAnnotationLayer={false}
//             />
//           </Document>
//         ) : (
//           <img
//             src={fileUrl}
//             alt="Uploaded Document"
//             className="w-full h-auto object-contain"
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default FileViewer;
import { normalizePosition } from "../utils/templateBuild";

type Field = {
  id: string;
  type: string;
  position: { x: number; y: number }; // Normalized coordinates
};

type Props = {
  file: File;
  onPlaceField?: (position: { x: number; y: number }) => void;
  fields?: Map<string, Field>;
};

const widthMap: Record<string, number> = {
  sm: 400,
  md: 600,
  lg: 800,
  xl: 1000,
};

const getSnappedBreakpoint = (width: number): string => {
  if (width >= 1280) return "xl";
  if (width >= 1024) return "lg";
  if (width >= 768) return "md";
  return "sm";
};

const aspectRatio = 8.5 / 11; // Standard letter size

const FileViewer = ({ file, onPlaceField, fields }: Props) => {
  const [previewWidth, setPreviewWidth] = useState(
    () => widthMap[getSnappedBreakpoint(window.innerWidth)],
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const documentRef = useRef<HTMLDivElement>(null); // Ref for the PDF page or image
  const currentBreakpoint = useRef(getSnappedBreakpoint(window.innerWidth));
  const [fileUrl, setFileUrl] = useState<string>("");
  const isPdf = file.type === "application/pdf";

  useEffect(() => {
    const fileUrl = URL.createObjectURL(file);
    setFileUrl(fileUrl);
    return () => URL.revokeObjectURL(fileUrl);
  }, [file]);

  useEffect(() => {
    const throttledResize = throttle(() => {
      const newBreakpoint = getSnappedBreakpoint(window.innerWidth);
      if (newBreakpoint !== currentBreakpoint.current) {
        currentBreakpoint.current = newBreakpoint;
        setPreviewWidth(widthMap[newBreakpoint]);
      }
    }, 250); // Adjust delay to match UX expectation

    window.addEventListener("resize", throttledResize);
    return () => {
      throttledResize.cancel();
      window.removeEventListener("resize", throttledResize);
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onPlaceField || !documentRef.current) return;
    const rect = documentRef.current.getBoundingClientRect();
    const position = normalizePosition(e.clientX, e.clientY, rect);
    console.log("Click coordinates:", {
      clientX: e.clientX,
      clientY: e.clientY,
    });
    console.log("Container rect:", rect);
    console.log("Normalized position:", position);
    onPlaceField(position);
  };

  const previewHeight = previewWidth / aspectRatio;

  return (
    <div
      ref={containerRef}
      className="relative w-full flex justify-center overflow-auto bg-gray-600 py-4"
    >
      <div
        ref={documentRef}
        className="relative bg-white shadow-md border border-gray-300"
        style={{ width: `${previewWidth}px`, height: `${previewHeight}px` }}
        onClick={handleClick}
      >
        {isPdf ? (
          <Document file={file}>
            <Page
              pageNumber={1}
              width={previewWidth}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              inputRef={(ref) => {
                if (ref) documentRef.current = ref;
              }}
            />
          </Document>
        ) : (
          <img
            src={fileUrl}
            alt="Uploaded Document"
            className="w-full h-auto object-contain"
            // ref={pageRef}
          />
        )}
        {/* Render Fields */}
        {Array.from(fields?.entries() ?? []).map(([_, field]) => {
          const fieldType = field.type as FieldType;
          const fieldPreview = templateBuilderFieldDefinitions[fieldType]?.render?.();

          return (
            <FieldWrapper
              key={field.id}
              field={field}
              previewWidth={previewWidth}
              previewHeight={previewHeight}
            >
              {fieldPreview}
            </FieldWrapper>
          );
        })}

      </div>
    </div>
  );
};

export default FileViewer;
