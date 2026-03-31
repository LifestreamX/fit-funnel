import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(' ');
}

export const statusColors: Record<string, string> = {
  NOT_CONTACTED: 'bg-gray-100 text-gray-800',
  CONTACTED: 'bg-blue-100 text-blue-800',
  NO_ANSWER: 'bg-yellow-100 text-yellow-800',
  NOT_INTERESTED: 'bg-red-100 text-red-800',
  ORIENTATION_BOOKED: 'bg-purple-100 text-purple-800',
  CONVERTED: 'bg-green-100 text-green-800',
};

export const statusLabels: Record<string, string> = {
  NOT_CONTACTED: 'Not Contacted',
  CONTACTED: 'Contacted',
  NO_ANSWER: 'No Answer',
  NOT_INTERESTED: 'Not Interested',
  ORIENTATION_BOOKED: 'Orientation Booked',
  CONVERTED: 'Converted',
};
