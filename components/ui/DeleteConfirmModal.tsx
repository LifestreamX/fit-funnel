'use client';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  loading = false,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-[60] flex items-center justify-center p-4'>
      <div
        className='absolute inset-0 bg-black/60 backdrop-blur-sm'
        onClick={onCancel}
      />

      <div className='relative w-full max-w-md animate-in fade-in zoom-in-95 duration-200'>
        <div className='rounded-2xl bg-white p-6 shadow-2xl'>
          <div className='mb-4 flex items-start gap-4'>
            <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100'>
              <svg
                className='h-6 w-6 text-red-600'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                />
              </svg>
            </div>

            <div className='flex-1'>
              <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
              <p className='mt-2 text-sm text-gray-600'>{message}</p>
            </div>
          </div>

          <div className='flex gap-3 pt-4'>
            <button
              onClick={onCancel}
              disabled={loading}
              className='flex-1 cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50'
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className='flex-1 cursor-pointer rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50'
            >
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
