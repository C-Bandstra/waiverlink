import { useRef, useState } from "react";
import FileViewer from "../../components/FileViewer";

const TemplateBuilder = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
      {/* Left Nav */}
      <aside className="w-full md:w-1/5 lg:w-1/6 xl:w-[15%] bg-gray-100 border-r border-gray-300 p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Add Field</h2>
        <ul className="space-y-2">
          <li className="p-2 bg-white rounded shadow hover:bg-gray-50 cursor-pointer">
            Input
          </li>
          <li className="p-2 bg-white rounded shadow hover:bg-gray-50 cursor-pointer">
            Signature
          </li>
          <li className="p-2 bg-white rounded shadow hover:bg-gray-50 cursor-pointer">
            Date
          </li>
          <li className="p-2 bg-white rounded shadow hover:bg-gray-50 cursor-pointer">
            Checkbox
          </li>
          {/* Add more as needed */}
        </ul>
      </aside>

      {/* Template In-Progress Viewer */}
      <main className="flex-1 bg-white p-1 overflow-hidden">
        <div className="h-full w-full overflow-auto">
          <p className="mx-auto">{selectedFile?.name}</p>
          <div className="relative min-h-[100%] border border-dashed border-gray-300 rounded-md flex text-gray-400 flex-col">
            {/* PDF viewer will be here */}
            {selectedFile ? (
              <FileViewer file={selectedFile} />
            ) : (
              <div className="m-auto text-sm">
                <div
                  onClick={handleClick}
                  className="p-[4rem] h-full border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-gray-400 transition-colors"
                >
                  <p className="text-lg font-medium">
                    Click to upload document
                  </p>
                  <p className="text-sm text-gray-300">PDF or image format</p>
                </div>
                <input
                  ref={inputRef}
                  type="file"
                  accept=".pdf,image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            )}
            {/* <div className="relative w-[612px] h-[816px] bg-white shadow-md border border-gray-300 mx-auto">
                <p className="text-center text-gray-400 mt-4">Mock Document Page</p>
            </div> */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TemplateBuilder;
