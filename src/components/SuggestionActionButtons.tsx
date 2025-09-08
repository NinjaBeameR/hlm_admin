import React, { useState } from 'react';
import { Trash2, Loader2, Eye, Clock } from 'lucide-react';

interface SuggestionActionButtonsProps {
  id: string;
  status: string;
  onMarkRead: (id: string) => Promise<void>;
  onMarkPending: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const SuggestionActionButtons: React.FC<SuggestionActionButtonsProps> = ({
  id,
  status,
  onMarkRead,
  onMarkPending,
  onDelete,
}) => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = async (action: string, callback: (id: string) => Promise<void>) => {
    setLoading(action);
    try {
      await callback(id);
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this suggestion? This action cannot be undone.')) {
      await handleAction('delete', onDelete);
    }
  };

  return (
    <div className="flex space-x-2">
      {/* Mark as Read Button */}
      {status !== 'read' && (
        <button
          onClick={() => handleAction('read', onMarkRead)}
          disabled={loading !== null}
          className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          title="Mark as Read"
        >
          {loading === 'read' ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Eye className="w-3 h-3" />
          )}
          <span className="ml-1 hidden sm:inline">Read</span>
        </button>
      )}

      {/* Mark as Pending Button */}
      {status !== 'pending' && (
        <button
          onClick={() => handleAction('pending', onMarkPending)}
          disabled={loading !== null}
          className="inline-flex items-center px-3 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          title="Mark as Pending"
        >
          {loading === 'pending' ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Clock className="w-3 h-3" />
          )}
          <span className="ml-1 hidden sm:inline">Pending</span>
        </button>
      )}

      {/* Delete Button */}
      <button
        onClick={handleDelete}
        disabled={loading !== null}
        className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        title="Delete"
      >
        {loading === 'delete' ? (
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
