'use client';

import React, { useEffect, useState } from 'react';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export default function PhoneInput({
  value,
  onChange,
  placeholder = '(555) 123-4567',
  required = false,
  className = '',
}: PhoneInputProps) {
  const formatPhoneNumber = (input: string) => {
    const numbers = input.replace(/\D/g, '');
    const limited = numbers.slice(0, 10);

    if (limited.length <= 3) {
      return limited;
    } else if (limited.length <= 6) {
      return `(${limited.slice(0, 3)}) ${limited.slice(3)}`;
    } else {
      return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6)}`;
    }
  };

  const [display, setDisplay] = useState(() => formatPhoneNumber(value || ''));

  useEffect(() => {
    setDisplay(formatPhoneNumber(value || ''));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setDisplay(formatted);
    onChange(formatted);
  };

  return (
    <input
      type='tel'
      value={display}
      onChange={handleChange}
      placeholder={placeholder}
      required={required}
      className={className}
      inputMode='tel'
      aria-label='phone'
    />
  );
}
