'use client';

import { useState } from 'react';
import { statusLabels } from '@/lib/utils';

interface OutreachModalProps {
  memberId: string;
  memberName: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const outcomes = [
  'CONTACTED',
  'NO_ANSWER',
  'NOT_INTERESTED',
  'ORIENTATION_BOOKED',
  'CONVERTED',
];

export default function OutreachModal({
  memberId,
  memberName,
  isOpen,
  onClose,
  onSubmit,
}: OutreachModalProps) {
  const [outcome, setOutcome] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!outcome) {
      setError('Please select an outcome');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId, outcome, notes }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to log outreach');
        return;
      }

      setOutcome('');
      setNotes('');
      onSubmit();
      onClose();
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
      <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-xl'>
        <h2 className='text-lg font-semibold text-gray-900'>Log Outreach</h2>
        <p className='mt-1 text-sm text-gray-500'>
          Recording outreach for {memberName}
        </p>

        {error && (
          <div className='mt-3 rounded-md bg-red-50 p-3 text-sm text-red-700'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='mt-4 space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Outcome
            </label>
            <select
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500'
            >
              <option value=''>Select outcome...</option>
              {outcomes.map((o) => (
                <option key={o} value={o}>
                  {statusLabels[o]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500'
              placeholder='Optional notes...'
            />
          </div>

          <div className='flex justify-end gap-3'>
            <button
              type='button'
              onClick={onClose}
              className='cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={loading}
              className='cursor-pointer rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50'
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
