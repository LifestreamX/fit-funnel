'use client';

import { useEffect, useState } from 'react';
import AuthGuard from '@/components/layout/AuthGuard';
import InviteTrainerModal from '@/components/ui/InviteTrainerModal';
import DeleteConfirmModal from '@/components/ui/DeleteConfirmModal';

interface TrainerData {
  id: string;
  name: string;
  email: string;
  role: 'MANAGER' | 'TRAINER';
  isPending: boolean;
  createdAt: string;
  stats: {
    assigned: number;
    contacted: number;
    booked: number;
    converted: number;
  };
}

export default function TrainersPage() {
  const [trainers, setTrainers] = useState<TrainerData[]>([]);
  const [showInvite, setShowInvite] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    trainer: TrainerData | null;
  }>({ isOpen: false, trainer: null });
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const fetchTrainers = () => {
    fetch('/api/trainers')
      .then((r) => r.json())
      .then(setTrainers);
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  const activeTrainers = trainers.filter((t) => !t.isPending);
  const pendingTrainers = trainers.filter((t) => t.isPending);

  const handleDeleteConfirm = async () => {
    if (!deleteModal.trainer) return;

    setDeleting(true);
    setError('');

    try {
      const res = await fetch(`/api/trainers/${deleteModal.trainer.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to delete trainer');
        return;
      }

      fetchTrainers();
      setDeleteModal({ isOpen: false, trainer: null });
    } catch {
      setError('Something went wrong');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AuthGuard requireRole='MANAGER'>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-bold text-gray-900'>Trainers</h1>
          <button
            onClick={() => setShowInvite(true)}
            className='cursor-pointer rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700'
          >
            + Invite Trainer
          </button>
        </div>

        {error && (
          <div className='rounded-lg bg-red-50 border border-red-200 p-4'>
            <p className='text-sm text-red-800'>{error}</p>
          </div>
        )}

        {/* Active Trainers */}
        <div>
          <h2 className='mb-4 text-lg font-semibold text-gray-900'>
            Active Trainers
          </h2>
          {activeTrainers.length === 0 ? (
            <div className='rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500'>
              No active trainers yet. Invite your first trainer!
            </div>
          ) : (
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {activeTrainers.map((trainer) => (
                <div
                  key={trainer.id}
                  className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow'
                >
                  <div className='flex items-start justify-between mb-3'>
                    <div className='flex-1'>
                      <div className='flex items-center gap-2'>
                        <h3 className='text-lg font-semibold text-gray-900'>
                          {trainer.name}
                        </h3>
                        {trainer.role === 'MANAGER' && (
                          <span className='px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded'>
                            Owner
                          </span>
                        )}
                      </div>
                      <p className='text-sm text-gray-500 mt-1'>
                        {trainer.email}
                      </p>
                    </div>
                    {trainer.role !== 'MANAGER' ? (
                      <button
                        onClick={() =>
                          setDeleteModal({ isOpen: true, trainer })
                        }
                        className='ml-2 cursor-pointer rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors'
                        title='Remove trainer'
                      >
                        <svg
                          className='h-5 w-5'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                          />
                        </svg>
                      </button>
                    ) : (
                      <div
                        className='ml-2 rounded-lg p-2 text-gray-300 cursor-not-allowed'
                        title='Cannot delete account owner'
                      >
                        <svg
                          className='h-5 w-5'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className='mt-4 grid grid-cols-2 gap-3'>
                    <div className='rounded-lg bg-gray-50 p-3 text-center'>
                      <p className='text-2xl font-bold text-gray-900'>
                        {trainer.stats.assigned}
                      </p>
                      <p className='text-xs text-gray-600 mt-1'>Assigned</p>
                    </div>
                    <div className='rounded-lg bg-blue-50 p-3 text-center'>
                      <p className='text-2xl font-bold text-blue-600'>
                        {trainer.stats.contacted}
                      </p>
                      <p className='text-xs text-blue-600 mt-1'>Contacted</p>
                    </div>
                    <div className='rounded-lg bg-purple-50 p-3 text-center'>
                      <p className='text-2xl font-bold text-purple-600'>
                        {trainer.stats.booked}
                      </p>
                      <p className='text-xs text-purple-600 mt-1'>Booked</p>
                    </div>
                    <div className='rounded-lg bg-green-50 p-3 text-center'>
                      <p className='text-2xl font-bold text-green-600'>
                        {trainer.stats.converted}
                      </p>
                      <p className='text-xs text-green-600 mt-1'>Converted</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Invites */}
        {pendingTrainers.length > 0 && (
          <div>
            <h2 className='mb-4 text-lg font-semibold text-gray-900'>
              Pending Invites
            </h2>
            <div className='overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                      Name
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                      Email
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                      Invited
                    </th>
                    <th className='px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {pendingTrainers.map((trainer) => (
                    <tr key={trainer.id} className='hover:bg-gray-50'>
                      <td className='whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900'>
                        {trainer.name}
                      </td>
                      <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>
                        {trainer.email}
                      </td>
                      <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>
                        {new Date(trainer.createdAt).toLocaleDateString()}
                      </td>
                      <td className='whitespace-nowrap px-6 py-4 text-right'>
                        <div className='flex items-center justify-end gap-3'>
                          <span className='inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800'>
                            Pending
                          </span>
                          <button
                            onClick={() =>
                              setDeleteModal({ isOpen: true, trainer })
                            }
                            className='cursor-pointer rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors'
                            title='Cancel invite'
                          >
                            <svg
                              className='h-5 w-5'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={deleteModal.isOpen}
          title={
            deleteModal.trainer?.isPending ? 'Cancel Invite' : 'Remove Trainer'
          }
          message={
            deleteModal.trainer?.isPending
              ? `Are you sure you want to cancel the invite for ${deleteModal.trainer.name}?`
              : `Are you sure you want to remove ${deleteModal.trainer?.name}? Their assigned members will be unassigned and all their outreach logs will be deleted. This action cannot be undone.`
          }
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteModal({ isOpen: false, trainer: null })}
          loading={deleting}
        />

        {/* Invite Modal */}
        <InviteTrainerModal
          isOpen={showInvite}
          onClose={() => setShowInvite(false)}
          onInvite={fetchTrainers}
        />
      </div>
    </AuthGuard>
  );
}
