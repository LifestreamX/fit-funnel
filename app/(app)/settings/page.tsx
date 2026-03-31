'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface PipelineStage {
  id: string;
  name: string;
  color: string;
  order: number;
  isDefault: boolean;
}

interface Tag {
  id: string;
  name: string;
  color: string;
  _count?: { members: number };
}

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'pipeline' | 'tags'>('pipeline');
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [newStageName, setNewStageName] = useState('');
  const [newStageColor, setNewStageColor] = useState('#6B7280');
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3B82F6');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if ((session?.user as any)?.role !== 'MANAGER') {
      router.push('/dashboard');
    } else {
      fetchData();
    }
  }, [status, session, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [stagesRes, tagsRes] = await Promise.all([
        fetch('/api/settings/pipeline'),
        fetch('/api/settings/tags'),
      ]);
      const stagesData = await stagesRes.json();
      const tagsData = await tagsRes.json();
      setStages(stagesData);
      setTags(tagsData);
    } catch {
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const addStage = async () => {
    if (!newStageName.trim()) return;
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/settings/pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newStageName,
          color: newStageColor,
          order: stages.length,
          isDefault: stages.length === 0, // First stage is default
        }),
      });

      if (res.ok) {
        setNewStageName('');
        setNewStageColor('#6B7280');
        setSuccess('Stage added successfully');
        fetchData();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to add stage');
      }
    } catch {
      setError('Failed to add stage');
    }
  };

  const deleteStage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this stage?')) return;

    try {
      const res = await fetch(`/api/settings/pipeline?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setSuccess('Stage deleted successfully');
        fetchData();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to delete stage');
      }
    } catch {
      setError('Failed to delete stage');
    }
  };

  const updateStage = async (id: string, updates: Partial<PipelineStage>) => {
    const updatedStages = stages.map((s) =>
      s.id === id ? { ...s, ...updates } : s,
    );
    setStages(updatedStages);

    try {
      const res = await fetch('/api/settings/pipeline', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stages: updatedStages }),
      });

      if (!res.ok) {
        setError('Failed to update stage');
        fetchData(); // Revert on error
      } else {
        setSuccess('Stage updated successfully');
      }
    } catch {
      setError('Failed to update stage');
      fetchData();
    }
  };

  const addTag = async () => {
    if (!newTagName.trim()) return;
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/settings/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newTagName,
          color: newTagColor,
        }),
      });

      if (res.ok) {
        setNewTagName('');
        setNewTagColor('#3B82F6');
        setSuccess('Tag added successfully');
        fetchData();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to add tag');
      }
    } catch {
      setError('Failed to add tag');
    }
  };

  const deleteTag = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tag?')) return;

    try {
      const res = await fetch(`/api/settings/tags?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setSuccess('Tag deleted successfully');
        fetchData();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to delete tag');
      }
    } catch {
      setError('Failed to delete tag');
    }
  };

  const moveStage = (index: number, direction: 'up' | 'down') => {
    const newStages = [...stages];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= stages.length) return;

    [newStages[index], newStages[targetIndex]] = [
      newStages[targetIndex],
      newStages[index],
    ];

    // Update order values
    newStages.forEach((stage, i) => {
      stage.order = i;
    });

    setStages(newStages);

    // Save to backend
    fetch('/api/settings/pipeline', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stages: newStages }),
    });
  };

  const colorOptions = [
    { name: 'Gray', value: '#6B7280' },
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Green', value: '#10B981' },
    { name: 'Yellow', value: '#F59E0B' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Orange', value: '#F97316' },
  ];

  if (loading || status === 'loading') {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-gray-600'>Loading...</div>
      </div>
    );
  }

  if ((session?.user as any)?.role !== 'MANAGER') {
    return null;
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold text-gray-900'>Settings</h1>
        <p className='text-gray-600 mt-1'>
          Configure your pipeline stages and tags
        </p>
      </div>

      {/* Tabs */}
      <div className='border-b border-gray-200'>
        <nav className='-mb-px flex space-x-8'>
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`${
              activeTab === 'pipeline'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            Pipeline Stages
          </button>
          <button
            onClick={() => setActiveTab('tags')}
            className={`${
              activeTab === 'tags'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            Tags
          </button>
        </nav>
      </div>

      {error && (
        <div className='rounded-lg bg-red-50 border border-red-200 p-4'>
          <p className='text-sm text-red-800'>{error}</p>
        </div>
      )}

      {success && (
        <div className='rounded-lg bg-green-50 border border-green-200 p-4'>
          <p className='text-sm text-green-800'>{success}</p>
        </div>
      )}

      {/* Pipeline Tab */}
      {activeTab === 'pipeline' && (
        <div className='space-y-6'>
          <div className='bg-white rounded-lg border border-gray-200 p-6'>
            <h2 className='text-lg font-semibold text-gray-900 mb-4'>
              Add New Stage
            </h2>
            <div className='flex gap-4 items-end'>
              <div className='flex-1'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Stage Name
                </label>
                <input
                  type='text'
                  value={newStageName}
                  onChange={(e) => setNewStageName(e.target.value)}
                  placeholder='e.g., New Lead, Trial Member, etc.'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Color
                </label>
                <select
                  value={newStageColor}
                  onChange={(e) => setNewStageColor(e.target.value)}
                  className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                >
                  {colorOptions.map((color) => (
                    <option key={color.value} value={color.value}>
                      {color.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={addStage}
                className='px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium'
              >
                Add Stage
              </button>
            </div>
          </div>

          <div className='bg-white rounded-lg border border-gray-200 p-6'>
            <h2 className='text-lg font-semibold text-gray-900 mb-4'>
              Pipeline Stages
            </h2>
            <div className='space-y-3'>
              {stages.map((stage, index) => (
                <div
                  key={stage.id}
                  className='flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors'
                >
                  <div className='flex items-center gap-4'>
                    <div className='flex flex-col gap-1'>
                      <button
                        onClick={() => moveStage(index, 'up')}
                        disabled={index === 0}
                        className='text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed'
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => moveStage(index, 'down')}
                        disabled={index === stages.length - 1}
                        className='text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed'
                      >
                        ▼
                      </button>
                    </div>
                    <div
                      className='w-4 h-4 rounded-full'
                      style={{ backgroundColor: stage.color }}
                    />
                    <input
                      type='text'
                      value={stage.name}
                      onChange={(e) =>
                        updateStage(stage.id, { name: e.target.value })
                      }
                      className='font-medium text-gray-900 border-0 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded px-2 py-1'
                    />
                    {stage.isDefault && (
                      <span className='text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded'>
                        Default
                      </span>
                    )}
                  </div>
                  <div className='flex items-center gap-3'>
                    <select
                      value={stage.color}
                      onChange={(e) =>
                        updateStage(stage.id, { color: e.target.value })
                      }
                      className='px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500'
                    >
                      {colorOptions.map((color) => (
                        <option key={color.value} value={color.value}>
                          {color.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => deleteStage(stage.id)}
                      className='px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium'
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {stages.length === 0 && (
                <p className='text-gray-500 text-center py-8'>
                  No pipeline stages yet. Add your first stage above!
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tags Tab */}
      {activeTab === 'tags' && (
        <div className='space-y-6'>
          <div className='bg-white rounded-lg border border-gray-200 p-6'>
            <h2 className='text-lg font-semibold text-gray-900 mb-4'>
              Add New Tag
            </h2>
            <div className='flex gap-4 items-end'>
              <div className='flex-1'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Tag Name
                </label>
                <input
                  type='text'
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder='e.g., VIP, Student, Corporate, etc.'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Color
                </label>
                <select
                  value={newTagColor}
                  onChange={(e) => setNewTagColor(e.target.value)}
                  className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                >
                  {colorOptions.map((color) => (
                    <option key={color.value} value={color.value}>
                      {color.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={addTag}
                className='px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium'
              >
                Add Tag
              </button>
            </div>
          </div>

          <div className='bg-white rounded-lg border border-gray-200 p-6'>
            <h2 className='text-lg font-semibold text-gray-900 mb-4'>Tags</h2>
            <div className='grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className='flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors'
                >
                  <div className='flex items-center gap-3'>
                    <div
                      className='w-3 h-3 rounded-full'
                      style={{ backgroundColor: tag.color }}
                    />
                    <span className='font-medium text-gray-900'>
                      {tag.name}
                    </span>
                    <span className='text-xs text-gray-500'>
                      ({tag._count?.members || 0})
                    </span>
                  </div>
                  <button
                    onClick={() => deleteTag(tag.id)}
                    className='text-red-600 hover:bg-red-50 p-1 rounded transition-colors text-sm'
                  >
                    ✕
                  </button>
                </div>
              ))}
              {tags.length === 0 && (
                <p className='text-gray-500 text-center py-8 col-span-full'>
                  No tags yet. Add your first tag above!
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
