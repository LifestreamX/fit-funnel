'use client';

import { useState, useEffect } from 'react';

interface Trainer {
  id: string;
  name: string;
}

interface TrainerAssignModalProps {
  memberId: string;
  memberName: string;
  currentTrainerId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onAssign: () => void;
}

export default function TrainerAssignModal({
  memberId,
  memberName,
  currentTrainerId,
  isOpen,
  onClose,
  onAssign,
}: TrainerAssignModalProps) {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [selectedTrainerId, setSelectedTrainerId] = useState(
    currentTrainerId || '',
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetch('/api/trainers')
        .then((res) => res.json())
        .then((data) => setTrainers(data))
        .catch(() => setError('Failed to load trainers'));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/members/${memberId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedToId: selectedTrainerId || null }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to assign trainer');
        return;
      }

      onAssign();
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
        <h2 className='text-lg font-semibold text-gray-900'>Assign Trainer</h2>
        <p className='mt-1 text-sm text-gray-500'>
          Assign a trainer to {memberName}
        </p>

        {error && (
          <div className='mt-3 rounded-md bg-red-50 p-3 text-sm text-red-700'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='mt-4 space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Trainer
            </label>
            <select
              value={selectedTrainerId}
              onChange={(e) => setSelectedTrainerId(e.target.value)}
              className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500'
            >
              <option value=''>Unassigned</option>
              {trainers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
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
              {loading ? 'Assigning...' : 'Assign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
