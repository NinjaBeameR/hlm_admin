import React, { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';

interface SuggestionActionButtonsProps {
  id: string;
  onDelete: (id: string) => Promise<void>;
}

const SuggestionActionButtons: React.FC<SuggestionActionButtonsProps> = ({
  id,
  onDelete,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this suggestion? This action cannot be undone.')) {
      setLoading(true);
      try {
        await onDelete(id);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex space-x-2">
      <button
        onClick={handleDelete}
        disabled={loading}
        className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        title="Delete"
      >
        {loading ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <Trash2 className="w-3 h-3" />
        )}
        <span className="ml-1 hidden sm:inline">Delete</span>
      </button>
    </div>
  );
};

export default SuggestionActionButtons;
