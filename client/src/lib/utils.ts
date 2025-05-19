import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2
  }).format(amount);
}

export const getInitials = (name: string) => {
  if (!name) return 'N/A';
  
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export const statesList = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 
  'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 
  'Enugu', 'Federal Capital Territory', 'Gombe', 'Imo', 'Jigawa', 
  'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 
  'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];

export const projectTypes = [
  'Residential', 
  'Commercial', 
  'Industrial', 
  'Mixed Use', 
  'Infrastructure',
  'Healthcare',
  'Educational', 
  'Recreational', 
  'Agricultural', 
  'Mining'
];

export const membershipGrades = [
  { value: 'associate', label: 'Associate Member' },
  { value: 'graduate', label: 'Graduate Member' },
  { value: 'corporate', label: 'Corporate Member' },
  { value: 'fellow', label: 'Fellow' }
];

export const applicationStatuses = [
  { value: 'draft', label: 'Draft', color: 'bg-gray-100 text-gray-800' },
  { value: 'submitted', label: 'Submitted', color: 'bg-blue-100 text-blue-800' },
  { value: 'under_review', label: 'Under Review', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'approved', label: 'Approved', color: 'bg-green-100 text-green-800' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' }
];

export const complaintStatuses = [
  { value: 'received', label: 'Received', color: 'bg-blue-100 text-blue-800' },
  { value: 'under_investigation', label: 'Under Investigation', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'resolved', label: 'Resolved', color: 'bg-green-100 text-green-800' },
  { value: 'closed', label: 'Closed', color: 'bg-gray-100 text-gray-800' }
];

export const getStatusColor = (status: string, type: 'application' | 'complaint' = 'application') => {
  const statuses = type === 'application' ? applicationStatuses : complaintStatuses;
  return statuses.find(s => s.value === status)?.color || 'bg-gray-100 text-gray-800';
};

export const truncateText = (text: string, maxLength: number) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
