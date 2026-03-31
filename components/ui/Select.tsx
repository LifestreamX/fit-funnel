'use client';

import { useState, useRef, useEffect } from 'react';

interface Option {
  value: string;
  label: string;
  color?: string;
}

interface SelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function Select({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  className = '',
  disabled = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type='button'
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between px-4 py-2.5 text-left bg-white border rounded-lg shadow-sm transition-all duration-200 ${
          disabled
            ? 'bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200'
            : isOpen
              ? 'border-orange-500 ring-2 ring-orange-200'
              : 'border-gray-300 hover:border-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
        }`}
      >
        <span className='flex items-center gap-2'>
          {selectedOption?.color && (
            <span
              className='w-2.5 h-2.5 rounded-full'
              style={{ backgroundColor: selectedOption.color }}
            />
          )}
          <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
            {selectedOption?.label || placeholder}
          </span>
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 9l-7 7-7-7'
          />
        </svg>
      </button>

      {isOpen && (
        <div className='absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden animate-fadeIn'>
          <div className='max-h-60 overflow-y-auto custom-scrollbar py-1'>
            {options.map((option) => (
              <button
                key={option.value}
                type='button'
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-4 py-2.5 text-left transition-colors ${
                  option.value === value
                    ? 'bg-orange-50 text-orange-900'
                    : 'text-gray-900 hover:bg-gray-50'
                }`}
              >
                {option.color && (
                  <span
                    className='w-2.5 h-2.5 rounded-full'
                    style={{ backgroundColor: option.color }}
                  />
                )}
                <span className='flex-1'>{option.label}</span>
                {option.value === value && (
                  <svg
                    className='w-5 h-5 text-orange-600'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
