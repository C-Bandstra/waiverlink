import { useState, useEffect } from "react";
import { pdfjs, Document, Page } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

// import workerSrc from 'pdfjs-dist/build/pdf.worker.entry';

const widthMap: Record<number, number> = {
  320: 300,   // Small screen — slightly larger but still narrow
  480: 420,   // Mobile — comfortably scaled
  768: 560,   // Tablet — larger, more readable
  1024: 760,  // Small laptop — closer to A4 width at screen scale
  1280: 920,  // Desktop — A4+ sizing
};


const breakpoints = Object.keys(widthMap).map(Number);

function getSnappedWidth(viewportWidth: number): number {
  const matched = breakpoints.reduce((acc, bp) => (viewportWidth >= bp ? bp : acc), 0);
  return widthMap[matched] ?? widthMap[320];
}

const aspectRatio = 8.5 / 11; // ~0.7727

const FileViewer = ({ file }: { file: File }) => {
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);
  const fileUrl = URL.createObjectURL(file);
  const isPdf = file.type === "application/pdf";

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const previewWidth = getSnappedWidth(viewportWidth);
  const previewHeight = previewWidth / aspectRatio;

  return (
    <div className="w-full flex justify-center overflow-auto bg-gray-600 py-1">
      <div
        className="bg-white shadow-md border border-gray-300"
      >
        {isPdf ? (
          <Document file={file}>
            <Page
              pageNumber={1}
              width={previewWidth}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
        ) : (
          <img
            src={fileUrl}
            alt="Uploaded Document"
            className="w-full h-auto object-contain"
          />
        )}
      </div>
    </div>
  );
};

export default FileViewer;
