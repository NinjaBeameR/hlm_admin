import React from 'react';
import { FileX, MessageSquare } from 'lucide-react';

interface EmptyStateProps {
  type: 'bugs' | 'suggestions';
}

const EmptyState: React.FC<EmptyStateProps> = ({ type }) => {
  const config = {
    bugs: {
      icon: FileX,
      title: 'No bug reports found',
      description: 'There are currently no bug reports to display.',
    },
    suggestions: {
      icon: MessageSquare,
      title: 'No suggestions found',
      description: 'There are currently no suggestions to display.',
    },
  };

  const { icon: Icon, title, description } = config[type];

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <Icon className="w-16 h-16 text-gray-400 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 max-w-md">{description}</p>
    </div>
  );
};

export default EmptyState;