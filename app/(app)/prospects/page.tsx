'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import AuthGuard from '@/components/layout/AuthGuard';
import MemberTable from '@/components/ui/MemberTable';
import OutreachModal from '@/components/ui/OutreachModal';
import EditMemberModal from '@/components/ui/EditMemberModal';
import PhoneInput from '@/components/ui/PhoneInput';
import { statusLabels } from '@/lib/utils';
import Select from '@/components/ui/Select';

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
}

interface Trainer {
  id: string;
  name: string;
}

export default function ProspectsPage() {
  const { data: session } = useSession();
  const [members, setMembers] = useState<Member[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [trainerFilter, setTrainerFilter] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [addError, setAddError] = useState('');
  const [editModal, setEditModal] = useState<{
    open: boolean;
    member: Member | null;
  }>({
    open: false,
    member: null,
  });
  const [outreachModal, setOutreachModal] = useState<{
    open: boolean;
    member: Member | null;
  }>({
    open: false,
    member: null,
  });

  const role = (session?.user as any)?.role;
  const isManager = role === 'MANAGER';

  const fetchMembers = () => {
    fetch('/api/members')
      .then((r) => r.json())
      .then((data) => {
        // Ensure createdBy is always present (null if missing)
        setMembers(
          data.map((m: any) => ({
            ...m,
            createdBy: m.createdBy ?? null,
          }))
        );
      });
  };

  const fetchTrainers = () => {
    if (isManager) {
      fetch('/api/trainers')
        .then((r) => r.json())
        .then(setTrainers);
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchTrainers();
  }, [isManager]);

  const filteredMembers = members.filter((m) => {
    if (statusFilter && m.status !== statusFilter) return false;
    if (trainerFilter) {
      if (trainerFilter === 'unassigned' && m.assignedTo !== null) return false;
      if (trainerFilter !== 'unassigned' && m.assignedTo?.id !== trainerFilter)
        return false;
    }
    return true;
  });

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');

    const res = await fetch('/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMember),
    });

    if (!res.ok) {
      const data = await res.json();
      setAddError(data.error || 'Failed to add member');
      return;
    }

    setNewMember({ firstName: '', lastName: '', email: '', phone: '' });
    setShowAddForm(false);
    fetchMembers();
  };

  return (
    <AuthGuard>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-bold text-gray-900'>
            {isManager ? 'All Prospects' : 'My Prospects'}
          </h1>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className='cursor-pointer rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700'
          >
            + Add Prospect
          </button>
        </div>

        {/* Add Member Form */}
        {showAddForm && (
          <div className='rounded-lg border border-gray-200 bg-white p-6'>
            <h2 className='text-lg font-semibold text-gray-900 mb-4'>
              Add New Prospect
            </h2>
            {addError && (
              <div className='mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700'>
                {addError}
              </div>
            )}
            <form
              onSubmit={handleAddMember}
              className='grid grid-cols-1 gap-4 sm:grid-cols-4'
            >
              <input
                type='text'
                placeholder='First Name *'
                value={newMember.firstName}
                onChange={(e) =>
                  setNewMember({ ...newMember, firstName: e.target.value })
                }
                required
                className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500'
              />
              <input
                type='text'
                placeholder='Last Name *'
                value={newMember.lastName}
                onChange={(e) =>
                  setNewMember({ ...newMember, lastName: e.target.value })
                }
                required
                className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500'
              />
              <input
                type='email'
                placeholder='Email'
                value={newMember.email}
                onChange={(e) =>
                  setNewMember({ ...newMember, email: e.target.value })
                }
                className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500'
              />
              <div className='flex gap-2'>
                <PhoneInput
                  value={newMember.phone}
                  onChange={(value) =>
                    setNewMember({ ...newMember, phone: value })
                  }
                  placeholder='(555) 123-4567'
                  className='flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500'
                />
                <button
                  type='submit'
                  className='cursor-pointer rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700'
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className='flex gap-4'>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: '', label: 'All Statuses' },
              ...Object.entries(statusLabels).map(([key, label]) => ({
                value: key,
                label,
              })),
            ]}
            className='min-w-[160px]'
          />
          {isManager && (
            <Select
              value={trainerFilter}
              onChange={setTrainerFilter}
              options={[
                { value: '', label: 'All Trainers' },
                { value: 'unassigned', label: 'Unassigned' },
                ...trainers.map((trainer) => ({
                  value: trainer.id,
                  label: trainer.name,
                })),
              ]}
              className='min-w-[160px]'
            />
          )}
        </div>

        {/* Member Table */}
        <MemberTable
          members={filteredMembers}
          showCreatedBy={isManager}
          onEdit={(member) => setEditModal({ open: true, member })}
          onLogOutreach={(member) => setOutreachModal({ open: true, member })}
        />

        {/* Edit Modal */}
        {editModal.member && (
          <EditMemberModal
            member={editModal.member}
            isOpen={editModal.open}
            onClose={() => setEditModal({ open: false, member: null })}
            onUpdate={fetchMembers}
          />
        )}

        {/* Outreach Modal */}
        {outreachModal.member && (
          <OutreachModal
            memberId={outreachModal.member.id}
            memberName={`${outreachModal.member.firstName} ${outreachModal.member.lastName}`}
            isOpen={outreachModal.open}
            onClose={() => setOutreachModal({ open: false, member: null })}
            onSubmit={fetchMembers}
          />
        )}
      </div>
    </AuthGuard>
  );
}
