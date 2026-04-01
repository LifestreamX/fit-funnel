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
  createdBy: { id: string; name: string } | null;
  updatedAt: string;
  tags?: { tag: { id: string; name: string; color: string } }[];
  logs?: {
    notes?: string | null;
    createdAt?: string | null;
    trainer?: { id: string; name: string } | null;
  }[];
}

interface MemberTableProps {
  members: Member[];
  showTrainer?: boolean;
  showCreatedBy?: boolean;
  onAssignTrainer?: (member: Member) => void;
  onEdit?: (member: Member) => void;
  onDelete?: (member: Member) => void;
  onLogOutreach?: (member: Member) => void;
}

export default function MemberTable({
  members,
  showTrainer = false,
  showCreatedBy = false,
  onAssignTrainer,
  onEdit,
  onDelete,
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
    <div>
      {/* Mobile: cards */}
      <div className='block md:hidden space-y-3'>
        {members.map((member) => (
          <div
            key={member.id}
            className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm'
          >
            <div className='flex items-start justify-between'>
              <div>
                <div className='font-medium text-sm text-gray-900'>
                  {member.firstName} {member.lastName}
                </div>
                {showCreatedBy && member.createdBy && (
                  <div className='text-xs text-gray-500'>
                    Added by {member.createdBy.name}
                  </div>
                )}
              </div>

              <div className='text-right'>
                <div className='text-xs text-gray-500'>
                  {new Date(member.updatedAt).toLocaleDateString()}
                </div>
                <div className='mt-2'>
                  <StatusBadge status={member.status} />
                </div>
              </div>
            </div>

            <div className='mt-3 text-sm text-gray-500'>
              <div className='truncate'>{member.phone || '—'}</div>
              <div className='truncate'>{member.email || '—'}</div>
              {member.logs && member.logs.length > 0 && member.logs[0].notes && (
                <div className='mt-2 text-xs text-gray-600'>📝 {member.logs[0].notes}</div>
              )}

              <div className='mt-2 flex flex-wrap gap-2'>
                {member.tags &&
                  member.tags.length > 0 &&
                  member.tags.map((mt) => (
                    <span
                      key={mt.tag.id}
                      className='inline-flex items-center gap-2 rounded-full px-2 py-0.5 text-xs font-medium text-white'
                      style={{ background: mt.tag.color }}
                    >
                      {mt.tag.name}
                    </span>
                  ))}
              </div>
            </div>

            <div className='mt-3 flex gap-2 justify-end'>
              {onEdit && (
                <button
                  onClick={() => onEdit(member)}
                  className='cursor-pointer text-gray-600 hover:text-gray-900 font-medium text-sm'
                >
                  Edit
                </button>
              )}
              {onAssignTrainer && (
                <button
                  onClick={() => onAssignTrainer(member)}
                  className='cursor-pointer text-orange-600 hover:text-orange-900 font-medium text-sm'
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
              {onDelete && (
                <button
                  onClick={() => onDelete(member)}
                  className='cursor-pointer text-gray-400 hover:text-red-600 transition-colors text-sm'
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop/tablet: original table */}
      <div className='hidden md:block overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm'>
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
              {showCreatedBy && (
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Added By
                </th>
              )}
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hidden md:table-cell'>
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
                <td className='whitespace-normal px-6 py-4 text-sm font-medium text-gray-900'>
                  <div className='flex flex-col'>
                    <div className='font-medium'>
                      {member.firstName} {member.lastName}
                    </div>

                    {member.logs &&
                      member.logs.length > 0 &&
                      member.logs[0].notes && (
                        <div className='mt-1 text-xs text-gray-500 max-w-[18rem] truncate'>
                          📝 {member.logs[0].notes}
                        </div>
                      )}

                    <div className='mt-2 flex flex-wrap gap-2'>
                      {member.tags &&
                        member.tags.length > 0 &&
                        member.tags.map((mt) => (
                          <span
                            key={mt.tag.id}
                            className='inline-flex items-center gap-2 rounded-full px-2 py-0.5 text-xs font-medium text-white'
                            style={{ background: mt.tag.color }}
                          >
                            {mt.tag.name}
                          </span>
                        ))}
                    </div>
                  </div>
                </td>
                <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500 max-w-[10rem] truncate'>
                  {member.phone || '—'}
                </td>
                <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500 max-w-[12rem] truncate'>
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
                {showCreatedBy && (
                  <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>
                    {member.createdBy ? (
                      member.createdBy.name
                    ) : (
                      <span className='text-gray-400 italic'>—</span>
                    )}
                  </td>
                )}
                <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500 hidden md:table-cell'>
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
                    {onDelete && (
                      <button
                        onClick={() => onDelete(member)}
                        className='cursor-pointer text-gray-400 hover:text-red-600 transition-colors'
                        title='Delete member'
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
                            d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
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
    </div>
  );
}
