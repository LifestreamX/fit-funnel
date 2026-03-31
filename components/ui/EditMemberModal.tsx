'use client';

import { useState } from 'react';
import PhoneInput from './PhoneInput';

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
}

interface EditMemberModalProps {
  member: Member;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export default function EditMemberModal({
  member,
  isOpen,
  onClose,
  onUpdate,
}: EditMemberModalProps) {
  const [firstName, setFirstName] = useState(member.firstName);
  const [lastName, setLastName] = useState(member.lastName);
  const [email, setEmail] = useState(member.email || '');
  const [phone, setPhone] = useState(member.phone || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/members/${member.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email: email || null,
          phone: phone || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to update member');
        setLoading(false);
        return;
      }

      onUpdate();
      onClose();
    } catch {
      setError('Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
      <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-xl'>
        <h2 className='text-lg font-semibold text-gray-900'>Edit Member</h2>
        <p className='mt-1 text-sm text-gray-500'>
          Update prospect information
        </p>

        {error && (
          <div className='mt-3 rounded-md bg-red-50 p-3 text-sm text-red-700'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='mt-4 space-y-4'>
          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                First Name *
              </label>
              <input
                type='text'
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Last Name *
              </label>
              <input
                type='text'
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500'
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Email
            </label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500'
              placeholder='email@example.com'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Phone
            </label>
            <PhoneInput
              value={phone}
              onChange={setPhone}
              placeholder='(555) 123-4567'
              className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500'
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
              className='cursor-pointer rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50 w-full mt-4'
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
