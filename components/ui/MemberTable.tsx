'use client';

import StatusBadge from './StatusBadge';

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  status: string;
  assignedTo: { id: string; name: string } | null;
  updatedAt: string;
}

interface MemberTableProps {
  members: Member[];
  showTrainer?: boolean;
  onAssignTrainer?: (member: Member) => void;
  onEdit?: (member: Member) => void;
  onLogOutreach?: (member: Member) => void;
}

export default function MemberTable({
  members,
  showTrainer = false,
  onAssignTrainer,
  onEdit,
  onLogOutreach,
}: MemberTableProps) {
  if (members.length === 0) {
    return (
      <div className='rounded-lg border border-gray-200 bg-white p-12 text-center'>
        <p className='text-gray-500'>No members found</p>
      </div>
    );
  }

  return (
    <div className='overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm'>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
              Name
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
              Phone
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
              Email
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
              Status
            </th>
            {showTrainer && (
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                Trainer
              </th>
            )}
            <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
              Last Updated
            </th>
            <th className='px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500'>
              Actions
            </th>
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-200'>
          {members.map((member, idx) => (
            <tr
              key={member.id}
              className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
            >
              <td className='whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900'>
                {member.firstName} {member.lastName}
              </td>
              <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>
                {member.phone || '—'}
              </td>
              <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>
                {member.email || '—'}
              </td>
              <td className='whitespace-nowrap px-6 py-4'>
                <StatusBadge status={member.status} />
              </td>
              {showTrainer && (
                <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>
                  {member.assignedTo ? (
                    member.assignedTo.name
                  ) : (
                    <span className='text-gray-400 italic'>Unassigned</span>
                  )}
                </td>
              )}
              <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>
                {new Date(member.updatedAt).toLocaleDateString()}
              </td>
              <td className='whitespace-nowrap px-6 py-4 text-right text-sm'>
                <div className='flex justify-end gap-2'>
                  {onEdit && (
                    <button
                      onClick={() => onEdit(member)}
                      className='cursor-pointer text-gray-600 hover:text-gray-900 font-medium'
                      title='Edit member info'
                    >
                      <svg
                        className='h-4 w-4'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                        />
                      </svg>
                    </button>
                  )}
                  {onAssignTrainer && (
                    <button
                      onClick={() => onAssignTrainer(member)}
                      className='cursor-pointer text-orange-600 hover:text-orange-900 font-medium'
                    >
                      Assign
                    </button>
                  )}
                  {onLogOutreach && (
                    <button
                      onClick={() => onLogOutreach(member)}
                      className='cursor-pointer rounded-md bg-orange-600 px-3 py-1 text-xs font-medium text-white hover:bg-orange-700'
                    >
                      Log Outreach
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
