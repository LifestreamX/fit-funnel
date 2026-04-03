'use client';
import Select from './Select';

interface ColumnMapperProps {
  csvHeaders: string[];
  mapping: Record<string, string>;
  onMappingChange: (field: string, csvHeader: string) => void;
}

const requiredFields = [
  { key: 'firstName', label: 'First Name', required: true },
  { key: 'lastName', label: 'Last Name', required: true },
  { key: 'email', label: 'Email', required: false },
  { key: 'phone', label: 'Phone', required: false },
];

export default function ColumnMapper({
  csvHeaders,
  mapping,
  onMappingChange,
}: ColumnMapperProps) {
  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-medium text-gray-900'>Map CSV Columns</h3>
      <p className='text-sm text-gray-500'>
        Map your CSV columns to member fields. First Name and Last Name are
        required.
      </p>

      <div className='space-y-3'>
        {requiredFields.map((field) => (
          <div
            key={field.key}
            className='flex flex-col md:flex-row md:items-center gap-2'
          >
            <label className='w-full md:w-32 text-sm font-medium text-gray-700 mb-1 md:mb-0'>
              {field.label}
              {field.required && <span className='text-red-500'> *</span>}
            </label>
            <Select
              value={mapping[field.key] || ''}
              onChange={(val) => onMappingChange(field.key, val)}
              options={[
                { value: '', label: '— Select column —' },
                ...csvHeaders.map((header) => ({ value: header, label: header })),
              ]}
              className='w-full md:flex-1'
            />
          </div>
        ))}
      </div>
    </div>
  );
}
