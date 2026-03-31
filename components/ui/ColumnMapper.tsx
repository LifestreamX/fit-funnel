'use client';

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
          <div key={field.key} className='flex items-center gap-4'>
            <label className='w-32 text-sm font-medium text-gray-700'>
              {field.label}
              {field.required && <span className='text-red-500'> *</span>}
            </label>
            <select
              value={mapping[field.key] || ''}
              onChange={(e) => onMappingChange(field.key, e.target.value)}
              className='flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500'
            >
              <option value=''>— Select column —</option>
              {csvHeaders.map((header) => (
                <option key={header} value={header}>
                  {header}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
