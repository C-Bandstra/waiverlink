import React from "react";

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div
      role="alert"
      className="max-w-lg mx-auto my-8 p-6 border-l-4 border-red-600 bg-red-50 text-red-800 rounded shadow-sm"
    >
      <h2 className="text-lg font-semibold">Whoops!</h2>
      <p className="mt-2">{message}</p>
    </div>
  );
};

export default ErrorMessage;