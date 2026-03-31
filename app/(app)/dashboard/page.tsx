'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/layout/AuthGuard';
import StatCard from '@/components/ui/StatCard';
import MemberTable from '@/components/ui/MemberTable';
import TrainerAssignModal from '@/components/ui/TrainerAssignModal';
import PhoneInput from '@/components/ui/PhoneInput';
import { statusLabels } from '@/lib/utils';

interface Stats {
  total: number;
  contacted: number;
  noAnswer: number;
  notInterested: number;
  booked: number;
  converted: number;
  notContacted: number;
}

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

interface Trainer {
  id: string;
  name: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [trainerFilter, setTrainerFilter] = useState('');
  const [assignModal, setAssignModal] = useState<{
    open: boolean;
    member: Member | null;
  }>({
    open: false,
    member: null,
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [addError, setAddError] = useState('');

  const fetchData = () => {
    fetch('/api/dashboard')
      .then((r) => r.json())
      .then(setStats);
    fetch('/api/members')
      .then((r) => r.json())
      .then(setMembers);
    fetch('/api/trainers')
      .then((r) => r.json())
      .then(setTrainers);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredMembers = members.filter((m) => {
    if (statusFilter && m.status !== statusFilter) return false;
    if (trainerFilter && m.assignedTo?.id !== trainerFilter) return false;
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
    fetchData();
  };

  return (
    <AuthGuard requireRole='MANAGER'>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-bold text-gray-900'>Dashboard</h1>
          <div className='flex gap-3'>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className='cursor-pointer rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50'
            >
              + Add Member
            </button>
            <button
              onClick={() => router.push('/import')}
              className='cursor-pointer rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700'
            >
              Import CSV
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        {stats && (
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
            <StatCard title='Total Prospects' value={stats.total} />
            <StatCard
              title='Contacted'
              value={stats.contacted}
              color='text-blue-600'
            />
            <StatCard
              title='Orientations Booked'
              value={stats.booked}
              color='text-purple-600'
            />
            <StatCard
              title='Converted'
              value={stats.converted}
              color='text-green-600'
            />
          </div>
        )}

        {/* Add Member Form */}
        {showAddForm && (
          <div className='rounded-lg border border-gray-200 bg-white p-6'>
            <h2 className='text-lg font-semibold text-gray-900 mb-4'>
              Add Member Manually
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
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500'
          >
            <option value=''>All Statuses</option>
            {Object.entries(statusLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          <select
            value={trainerFilter}
            onChange={(e) => setTrainerFilter(e.target.value)}
            className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500'
          >
            <option value=''>All Trainers</option>
            {trainers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Member Table */}
        <MemberTable
          members={filteredMembers}
          showTrainer
          onAssignTrainer={(member) => setAssignModal({ open: true, member })}
        />

        {/* Assign Trainer Modal */}
        {assignModal.member && (
          <TrainerAssignModal
            memberId={assignModal.member.id}
            memberName={`${assignModal.member.firstName} ${assignModal.member.lastName}`}
            currentTrainerId={assignModal.member.assignedTo?.id || null}
            isOpen={assignModal.open}
            onClose={() => setAssignModal({ open: false, member: null })}
            onAssign={fetchData}
          />
        )}
      </div>
    </AuthGuard>
  );
}
