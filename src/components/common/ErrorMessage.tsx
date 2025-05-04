import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 flex items-start">
      <div className="mr-2 mt-0.5">
        <AlertCircle size={18} />
      </div>
      <span>{message}</span>
    </div>
  );
};

export default ErrorMessage;