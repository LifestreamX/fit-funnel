'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/layout/AuthGuard';
import StatCard from '@/components/ui/StatCard';
import MemberTable from '@/components/ui/MemberTable';
import TrainerAssignModal from '@/components/ui/TrainerAssignModal';
import OutreachModal from '@/components/ui/OutreachModal';
import PhoneInput from '@/components/ui/PhoneInput';
import { statusLabels } from '@/lib/utils';
import Select from '@/components/ui/Select';

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
  createdBy: { id: string; name: string } | null;
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
  const [nameFilter, setNameFilter] = useState('');
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

  const fetchMembers = () => {
    fetch('/api/members')
      .then((r) => r.json())
      .then((data) => {
        setMembers(
          data.map((m: any) => ({
            ...m,
            createdBy: m.createdBy ?? null,
          })),
        );
      });
  };

  const fetchData = () => {
    fetch('/api/dashboard')
      .then((r) => r.json())
      .then(setStats);
    fetchMembers();
    fetch('/api/trainers')
      .then(async (r) => {
        if (!r.ok) {
          const txt = await r.text().catch(() => null);
          console.error('/api/trainers fetch failed', r.status, txt);
          return [];
        }
        const txt = await r.text().catch(() => null);
        if (!txt) return [];
        try {
          return JSON.parse(txt);
        } catch (err) {
          console.error('Failed to parse /api/trainers JSON', err, txt);
          return [];
        }
      })
      .then(setTrainers)
      .catch((err) => {
        console.error('Unexpected error fetching /api/trainers', err);
        setTrainers([]);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredMembers = members.filter((m) => {
    if (statusFilter && m.status !== statusFilter) return false;
    if (trainerFilter && m.assignedTo?.id !== trainerFilter) return false;
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
    fetchData();
  };

  const [outreachModal, setOutreachModal] = useState<{
    open: boolean;
    member: Member | null;
  }>({
    open: false,
    member: null,
  });

  return (
    <AuthGuard requireRole='MANAGER'>
      <div className='space-y-6'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
          <h1 className='text-2xl font-bold text-gray-900'>Dashboard</h1>
          <div className='flex flex-col sm:flex-row gap-3'>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className='w-full sm:w-auto cursor-pointer rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50'
            >
              + Add Member
            </button>
            <button
              onClick={() => router.push('/import')}
              className='w-full sm:w-auto cursor-pointer rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700'
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
        <div className='flex flex-col md:flex-row gap-4 items-center'>
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
            value={trainerFilter}
            onChange={setTrainerFilter}
            options={[
              { value: '', label: 'All Trainers' },
              ...trainers.map((t) => ({ value: t.id, label: t.name })),
            ]}
            className='w-full md:min-w-[160px]'
          />

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
          showTrainer
          showCreatedBy
          onAssignTrainer={(member) => setAssignModal({ open: true, member })}
          onLogOutreach={(member) => setOutreachModal({ open: true, member })}
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

        {/* Outreach Modal */}
        {outreachModal.member && (
          <OutreachModal
            memberId={outreachModal.member.id}
            memberName={`${outreachModal.member.firstName} ${outreachModal.member.lastName}`}
            isOpen={outreachModal.open}
            onClose={() => setOutreachModal({ open: false, member: null })}
            onSubmit={fetchData}
          />
        )}
      </div>
    </AuthGuard>
  );
}
