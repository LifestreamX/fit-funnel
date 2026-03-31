'use client';

import { useCallback } from 'react';

interface CSVUploaderProps {
  onFileSelect: (file: File) => void;
}

export default function CSVUploader({ onFileSelect }: CSVUploaderProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.name.endsWith('.csv')) {
        onFileSelect(file);
      }
    },
    [onFileSelect],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className='flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-orange-400 transition-colors'
    >
      <svg
        className='mx-auto h-12 w-12 text-gray-400'
        stroke='currentColor'
        fill='none'
        viewBox='0 0 48 48'
      >
        <path
          d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
          strokeWidth={2}
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
      <div className='mt-4'>
        <label className='cursor-pointer rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700'>
          Choose CSV File
          <input
            type='file'
            accept='.csv'
            onChange={handleChange}
            className='hidden'
          />
        </label>
      </div>
      <p className='mt-2 text-sm text-gray-500'>
        or drag and drop a CSV file here
      </p>
    </div>
  );
}
