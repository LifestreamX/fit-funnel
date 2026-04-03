'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import AuthGuard from '@/components/layout/AuthGuard';
import MemberTable from '@/components/ui/MemberTable';
import OutreachModal from '@/components/ui/OutreachModal';
import EditMemberModal from '@/components/ui/EditMemberModal';
import DeleteConfirmModal from '@/components/ui/DeleteConfirmModal';
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
  const [tagFilter, setTagFilter] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [availableTags, setAvailableTags] = useState<
    { id: string; name: string }[]
  >([]);
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
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    member: Member | null;
  }>({
    open: false,
    member: null,
  });
  const [deleting, setDeleting] = useState(false);

  const role = (session?.user as any)?.role;
  const isManager = role === 'MANAGER';

  const fetchMembers = (tagId?: string) => {
    const q = tagId ? `?tagId=${encodeURIComponent(tagId)}` : '';
    fetch(`/api/members${q}`)
      .then((r) => r.json())
      .then((data) => {
        // Ensure createdBy is always present (null if missing)
        setMembers(
          data.map((m: any) => ({
            ...m,
            createdBy: m.createdBy ?? null,
          })),
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

  const fetchTags = () => {
    fetch('/api/settings/tags')
      .then(async (r) => {
        if (!r.ok) return [];
        try {
          const data = await r.json();
          return Array.isArray(data) ? data : [];
        } catch {
          return [];
        }
      })
      .then((data) => setAvailableTags(data))
      .catch(() => setAvailableTags([]));
  };

  useEffect(() => {
    fetchMembers(tagFilter || undefined);
    fetchTrainers();
    fetchTags();
  }, [isManager]);

  useEffect(() => {
    fetchMembers(tagFilter || undefined);
  }, [tagFilter]);

  const filteredMembers = members.filter((m) => {
    if (statusFilter && m.status !== statusFilter) return false;
    if (trainerFilter) {
      if (trainerFilter === 'unassigned' && m.assignedTo !== null) return false;
      if (trainerFilter !== 'unassigned' && m.assignedTo?.id !== trainerFilter)
        return false;
    }
    if (nameFilter) {
      const q = nameFilter.trim().toLowerCase();
      const fullName = `${m.firstName || ''} ${m.lastName || ''}`.toLowerCase();
      if (!fullName.includes(q)) return false;
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

  const handleDeleteMember = async () => {
    if (!deleteModal.member) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/members/${deleteModal.member.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to delete member');
      } else {
        fetchMembers();
      }
    } catch {
      alert('Something went wrong');
    } finally {
      setDeleting(false);
      setDeleteModal({ open: false, member: null });
    }
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
              className='grid grid-cols-1 gap-4 md:grid-cols-2'
            >
              <input
                type='text'
                placeholder='First Name *'
                value={newMember.firstName}
                onChange={(e) =>
                  setNewMember({ ...newMember, firstName: e.target.value })
                }
                required
                className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 md:col-span-1'
              />
              <input
                type='text'
                placeholder='Last Name *'
                value={newMember.lastName}
                onChange={(e) =>
                  setNewMember({ ...newMember, lastName: e.target.value })
                }
                required
                className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 md:col-span-1'
              />
              <input
                type='email'
                placeholder='Email'
                value={newMember.email}
                onChange={(e) =>
                  setNewMember({ ...newMember, email: e.target.value })
                }
                className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 md:col-span-1'
              />
              <div className='flex flex-col md:flex-row gap-2 md:col-span-1'>
                <PhoneInput
                  value={newMember.phone}
                  onChange={(value) =>
                    setNewMember({ ...newMember, phone: value })
                  }
                  placeholder='(555) 123-4567'
                  className='w-full md:flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500'
                />
                <button
                  type='button'
                  onClick={() => setShowAddForm(false)}
                  className='w-full md:w-auto cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='w-full md:w-auto cursor-pointer rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700'
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className='flex flex-col md:flex-row gap-3 md:gap-4 items-center'>
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
            className='w-full md:min-w-[160px]'
          />
          <Select
            value={tagFilter}
            onChange={setTagFilter}
            options={[
              { value: '', label: 'All Tags' },
              ...availableTags.map((t) => ({ value: t.id, label: t.name })),
            ]}
            className='w-full md:min-w-[160px]'
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
              className='w-full md:min-w-[160px]'
            />
          )}

          <div className='w-full md:w-64'>
            <input
              type='text'
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              placeholder='Search name...'
              className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500'
            />
          </div>
        </div>

        {/* Member Table */}
        <MemberTable
          members={filteredMembers}
          showCreatedBy={isManager}
          onEdit={(member) => setEditModal({ open: true, member })}
          onDelete={(member) => setDeleteModal({ open: true, member })}
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

        {/* Delete Modal */}
        {deleteModal.member && (
          <DeleteConfirmModal
            isOpen={deleteModal.open}
            title='Delete Prospect'
            message={`Are you sure you want to delete ${deleteModal.member.firstName} ${deleteModal.member.lastName}? This will also delete all their outreach logs and history. This action cannot be undone.`}
            onConfirm={handleDeleteMember}
            onCancel={() => setDeleteModal({ open: false, member: null })}
            loading={deleting}
          />
        )}
      </div>
    </AuthGuard>
  );
}
