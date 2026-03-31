interface StatCardProps {
  title: string;
  value: number | string;
  color?: string;
}

export default function StatCard({
  title,
  value,
  color = 'text-gray-900',
}: StatCardProps) {
  return (
    <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
      <p className='text-sm font-medium text-gray-500'>{title}</p>
      <p className={`mt-2 text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
