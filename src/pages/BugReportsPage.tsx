import React from 'react';
import { Bug } from 'lucide-react';
import DataTable from '../components/DataTable';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { useBugReports } from '../hooks/useBugReports';
import type { BugReport } from '../types';

const BugReportsPage: React.FC = () => {
  const { data, loading, error, refetch } = useBugReports();

  const columns = [
    {
      key: 'title' as keyof BugReport,
      label: 'Title',
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
      key: 'severity' as keyof BugReport,
      label: 'Severity',
      sortable: true,
      render: (value: string) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          value === 'critical' ? 'bg-red-100 text-red-800' :
          value === 'high' ? 'bg-orange-100 text-orange-800' :
          value === 'medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
    {
      key: 'status' as keyof BugReport,
      label: 'Status',
      sortable: true,
      render: (value: string) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          value === 'new' ? 'bg-blue-100 text-blue-800' :
          value === 'investigating' ? 'bg-purple-100 text-purple-800' :
          value === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
          value === 'resolved' ? 'bg-green-100 text-green-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value.replace('_', ' ').charAt(0).toUpperCase() + value.replace('_', ' ').slice(1)}
        </span>
      ),
    },
    {
      key: 'created_at' as keyof BugReport,
      label: 'Date Created',
      sortable: true,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSpinner size="lg" text="Loading bug reports..." />
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
            <Bug className="w-8 h-8 text-red-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Bug Reports</h1>
          </div>
          <p className="text-gray-600">
            Track and monitor reported issues from users. Data is automatically refreshed and sorted by most recent.
          </p>
          <div className="mt-2 text-sm text-gray-500">
            Total reports: {data.length}
          </div>
        </div>

        {data.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm">
            <EmptyState type="bugs" />
          </div>
        ) : (
          <DataTable
            data={data}
            columns={columns}
            emptyMessage="No bug reports found"
          />
        )}
      </div>
    </div>
  );
};

export default BugReportsPage;