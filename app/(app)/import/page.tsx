'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Papa from 'papaparse';
import AuthGuard from '@/components/layout/AuthGuard';
import CSVUploader from '@/components/ui/CSVUploader';
import ColumnMapper from '@/components/ui/ColumnMapper';

type Step = 'upload' | 'map' | 'confirm';

export default function ImportPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('upload');
  const [csvData, setCsvData] = useState<Record<string, string>[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    count: number;
  } | null>(null);
  const [error, setError] = useState('');

  const handleFileSelect = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as Record<string, string>[];
        const headers = results.meta.fields || [];

        setCsvData(data);
        setCsvHeaders(headers);

        // Auto-map common column names
        const autoMapping: Record<string, string> = {};
        headers.forEach((h) => {
          const lower = h.toLowerCase().trim();
          if (lower.includes('first') && lower.includes('name'))
            autoMapping.firstName = h;
          else if (lower.includes('last') && lower.includes('name'))
            autoMapping.lastName = h;
          else if (lower === 'email' || lower.includes('email'))
            autoMapping.email = h;
          else if (lower === 'phone' || lower.includes('phone'))
            autoMapping.phone = h;
        });
        setMapping(autoMapping);
        setStep('map');
      },
      error: () => {
        setError('Failed to parse CSV file');
      },
    });
  };

  const handleMappingChange = (field: string, csvHeader: string) => {
    setMapping((prev) => ({ ...prev, [field]: csvHeader }));
  };

  const handleConfirm = () => {
    if (!mapping.firstName || !mapping.lastName) {
      setError('First Name and Last Name mappings are required');
      return;
    }
    setError('');
    setStep('confirm');
  };

  const validRows = csvData.filter(
    (row) => row[mapping.firstName]?.trim() && row[mapping.lastName]?.trim(),
  );

  const handleImport = async () => {
    setLoading(true);
    setError('');

    const members = validRows.map((row) => ({
      firstName: row[mapping.firstName]?.trim(),
      lastName: row[mapping.lastName]?.trim(),
      email: mapping.email ? row[mapping.email]?.trim() || null : null,
      phone: mapping.phone ? row[mapping.phone]?.trim() || null : null,
    }));

    try {
      const res = await fetch('/api/members/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ members }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Import failed');
        setLoading(false);
        return;
      }

      const data = await res.json();
      setResult({ success: true, count: data.count });
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-bold text-gray-900'>Import Members</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className='cursor-pointer text-sm text-gray-500 hover:text-gray-700'
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Step Indicator */}
        <div className='flex items-center gap-4'>
          {['Upload CSV', 'Map Columns', 'Confirm & Import'].map(
            (label, idx) => {
              const stepIdx = ['upload', 'map', 'confirm'].indexOf(step);
              const isActive = idx === stepIdx;
              const isComplete = idx < stepIdx;
              return (
                <div key={label} className='flex items-center gap-2'>
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                      isActive
                        ? 'bg-orange-600 text-white'
                        : isComplete
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {isComplete ? '✓' : idx + 1}
                  </div>
                  <span
                    className={`text-sm ${isActive ? 'font-medium text-gray-900' : 'text-gray-500'}`}
                  >
                    {label}
                  </span>
                  {idx < 2 && <div className='mx-2 h-px w-12 bg-gray-300' />}
                </div>
              );
            },
          )}
        </div>

        {error && (
          <div className='rounded-md bg-red-50 p-3 text-sm text-red-700'>
            {error}
          </div>
        )}

        {/* Step 1: Upload */}
        {step === 'upload' && <CSVUploader onFileSelect={handleFileSelect} />}

        {/* Step 2: Map Columns */}
        {step === 'map' && (
          <div className='space-y-6'>
            {/* Preview */}
            <div className='rounded-lg border border-gray-200 bg-white p-6'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>
                CSV Preview (first 5 rows)
              </h3>
              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200 text-sm'>
                  <thead className='bg-gray-50'>
                    <tr>
                      {csvHeaders.map((h) => (
                        <th
                          key={h}
                          className='px-4 py-2 text-left font-medium text-gray-500'
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200'>
                    {csvData.slice(0, 5).map((row, idx) => (
                      <tr key={idx}>
                        {csvHeaders.map((h) => (
                          <td key={h} className='px-4 py-2 text-gray-700'>
                            {row[h] || '—'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Column Mapper */}
            <div className='rounded-lg border border-gray-200 bg-white p-6'>
              <ColumnMapper
                csvHeaders={csvHeaders}
                mapping={mapping}
                onMappingChange={handleMappingChange}
              />
            </div>

            <div className='flex justify-end'>
              <button
                onClick={handleConfirm}
                className='cursor-pointer rounded-md bg-orange-600 px-6 py-2 text-sm font-medium text-white hover:bg-orange-700'
              >
                Next: Confirm
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirm & Import */}
        {step === 'confirm' && !result && (
          <div className='rounded-lg border border-gray-200 bg-white p-6 space-y-4'>
            <h3 className='text-lg font-medium text-gray-900'>
              Ready to Import
            </h3>
            <p className='text-sm text-gray-600'>
              <strong>{validRows.length}</strong> valid rows will be imported
              out of <strong>{csvData.length}</strong> total rows.
            </p>
            <div className='flex gap-3'>
              <button
                onClick={() => setStep('map')}
                className='cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'
              >
                Back
              </button>
              <button
                onClick={handleImport}
                disabled={loading}
                className='cursor-pointer rounded-md bg-orange-600 px-6 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50'
              >
                {loading ? 'Importing...' : 'Import Members'}
              </button>
            </div>
          </div>
        )}

        {/* Success */}
        {result && result.success && (
          <div className='rounded-lg border border-green-200 bg-green-50 p-6 text-center'>
            <p className='text-lg font-medium text-green-800'>
              Successfully imported {result.count} members!
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className='mt-4 cursor-pointer rounded-md bg-orange-600 px-6 py-2 text-sm font-medium text-white hover:bg-orange-700'
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
