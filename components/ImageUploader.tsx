
import React, { useState, useCallback } from 'react';
import type { ImageFile } from '../types';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (imageFile: ImageFile) => void;
}

const fileToBase64 = (file: File): Promise<ImageFile> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(',')[1];
      resolve({ dataUrl, base64, mimeType: file.type });
    };
    reader.onerror = error => reject(error);
  });
};

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
        setError('Nahrajte prosím platný obrázkový soubor (PNG, JPG atd.).');
        return;
    }
    setError(null);
    try {
        const imageFile = await fileToBase64(file);
        onImageUpload(imageFile);
    } catch (err) {
        setError('Nepodařilo se přečíst obrázkový soubor.');
        console.error(err);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [onImageUpload]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center">
      <h2 className="text-2xl font-bold mb-4">Přetvořte svůj prostor</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Pro začátek nahrajte fotku vaší místnosti.</p>
      
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-10 cursor-pointer transition-colors ${isDragging ? 'border-indigo-500 bg-indigo-50 dark:bg-gray-700' : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400'}`}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
        <label htmlFor="file-upload" className="flex flex-col items-center cursor-pointer">
          <UploadIcon />
          <p className="mt-4 text-lg font-semibold">Přetáhněte obrázek sem</p>
          <p className="text-gray-500">nebo klikněte pro výběr</p>
        </label>
      </div>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};
