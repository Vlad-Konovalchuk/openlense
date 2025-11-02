import { FileQuestion } from 'lucide-react';

type EmptyStateProps = {
  label: string;
  className?: string;
};

export const EmptyState = ({ label, className = '' }: EmptyStateProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 ${className}`}
    >
      <FileQuestion className='w-16 h-16 text-gray-400 mb-4' />
      <p className='text-gray-500 text-lg'>{label}</p>
    </div>
  );
};
