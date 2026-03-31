'use client';

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
    // Remove all non-numeric characters
    const numbers = input.replace(/\D/g, '');

    // Limit to 10 digits
    const limited = numbers.slice(0, 10);

    // Format as (XXX) XXX-XXXX
    if (limited.length <= 3) {
      return limited;
    } else if (limited.length <= 6) {
      return `(${limited.slice(0, 3)}) ${limited.slice(3)}`;
    } else {
      return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6)}`;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    onChange(formatted);
  };

  return (
    <input
      type='tel'
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      required={required}
      className={className}
    />
  );
}
