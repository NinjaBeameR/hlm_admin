import React from 'react';
import { MessageSquare } from 'lucide-react';
import DataTable from '../components/DataTable';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { useSuggestions } from '../hooks/useSuggestions';
import type { Suggestion } from '../types';

const SuggestionsPage: React.FC = () => {
  const { data, loading, error, refetch } = useSuggestions();

  const columns = [
    {
      key: 'description' as keyof Suggestion,
      label: 'Description',
      sortable: true,
      render: (value: string) => (
        <div className="max-w-md">
          <p className="truncate" title={value}>
            {value}
          </p>
        </div>
      ),
    },
    {
      key: 'created_at' as keyof Suggestion,
      label: 'Date Created',
      sortable: true,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSpinner size="lg" text="Loading suggestions..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorMessage message={error.message} onRetry={refetch} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <MessageSquare className="w-8 h-8 text-green-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">User Suggestions</h1>
          </div>
          <p className="text-gray-600">
            Review feedback and feature requests from users. Data is automatically refreshed and sorted by most recent.
          </p>
          <div className="mt-2 text-sm text-gray-500">
            Total suggestions: {data.length}
          </div>
        </div>

        {data.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm">
            <EmptyState type="suggestions" />
          </div>
        ) : (
          <DataTable
            data={data}
            columns={columns}
            emptyMessage="No suggestions found"
          />
        )}
      </div>
    </div>
  );
};

export default SuggestionsPage;