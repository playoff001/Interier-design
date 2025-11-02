
import React from 'react';
import { SpinnerIcon } from './icons';

interface LoadingOverlayProps {
  message: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl flex flex-col items-center gap-4">
        <SpinnerIcon />
        <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{message}</p>
      </div>
    </div>
  );
};
