import React, { useState } from 'react';
import { Check, AlertTriangle, Trash2, Loader2 } from 'lucide-react';

interface ActionButtonsProps {
  id: string;
  status: string;
  onMarkFixed: (id: string) => Promise<void>;
  onMarkSpam: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  id,
  status,
  onMarkFixed,
  onMarkSpam,
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
    if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      await handleAction('delete', onDelete);
    }
  };

  return (
    <div className="flex space-x-2">
      {/* Mark as Fixed Button */}
      {status !== 'fixed' && status !== 'spam' && (
        <button
          onClick={() => handleAction('fixed', onMarkFixed)}
          disabled={loading !== null}
          className="inline-flex items-center px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          title="Mark as Fixed"
        >
          {loading === 'fixed' ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Check className="w-3 h-3" />
          )}
          <span className="ml-1 hidden sm:inline">Fixed</span>
        </button>
      )}

      {/* Mark as Spam Button */}
      {status !== 'spam' && status !== 'fixed' && (
        <button
          onClick={() => handleAction('spam', onMarkSpam)}
          disabled={loading !== null}
          className="inline-flex items-center px-3 py-1 text-xs font-medium text-orange-700 bg-orange-100 rounded-full hover:bg-orange-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          title="Mark as Spam"
        >
          {loading === 'spam' ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <AlertTriangle className="w-3 h-3" />
          )}
          <span className="ml-1 hidden sm:inline">Spam</span>
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

export default ActionButtons;
