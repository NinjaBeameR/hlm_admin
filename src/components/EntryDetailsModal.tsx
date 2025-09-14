import React from 'react';

interface EntryDetailsModalProps {
  open: boolean;
  onClose: () => void;
  entry: {
    description: string;
    app_version?: string;
    created_at: string;
    screenshot_url?: string;
    [key: string]: any;
  };
}

const EntryDetailsModal: React.FC<EntryDetailsModalProps> = ({ open, onClose, entry }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Entry Details</h2>
        <div className="mb-2"><strong>Description:</strong> <div className="whitespace-pre-wrap break-words">{entry.description}</div></div>
        {entry.app_version && <div className="mb-2"><strong>App Version:</strong> {entry.app_version}</div>}
        <div className="mb-2"><strong>Date Submitted:</strong> {entry.created_at}</div>
        {entry.screenshot_url && (
          <div className="mb-2">
            <strong>Screenshot:</strong>
            <a href={entry.screenshot_url} target="_blank" rel="noopener noreferrer">
              <img src={entry.screenshot_url} alt="Screenshot" className="mt-2 max-w-full h-auto rounded" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default EntryDetailsModal;
