import React, { useState, useMemo } from 'react';
import { Bug, CheckCircle2, AlertTriangle, Archive } from 'lucide-react';
import DataTable from '../components/DataTable';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import ActionButtons from '../components/ActionButtons';
import { useBugReports } from '../hooks/useBugReports';
import { updateBugReportStatus, deleteBugReport } from '../utils/supabase';
import type { BugReport } from '../types';

type FilterType = 'all' | 'active' | 'fixed' | 'spam';

const BugReportsPage: React.FC = () => {
  const { data, loading, error, refetch } = useBugReports();
  const [filter, setFilter] = useState<FilterType>('active');

  // Filter data based on current filter
  const filteredData = useMemo(() => {
    switch (filter) {
      case 'active':
        return data.filter(item => !['fixed', 'spam'].includes(item.status || 'new'));
      case 'fixed':
        return data.filter(item => item.status === 'fixed');
      case 'spam':
        return data.filter(item => item.status === 'spam');
      default:
        return data;
    }
  }, [data, filter]);

  const handleMarkFixed = async (id: string) => {
    const result = await updateBugReportStatus(id, 'fixed');
    if (result.error) {
      alert(`Error: ${result.error.message}`);
    } else {
      await refetch();
    }
  };

  const handleMarkSpam = async (id: string) => {
    const result = await updateBugReportStatus(id, 'spam');
    if (result.error) {
      alert(`Error: ${result.error.message}`);
    } else {
      await refetch();
    }
  };

  const handleMarkRead = async (id: string) => {
    const result = await updateBugReportStatus(id, 'read');
    if (result.error) {
      alert(`Error: ${result.error.message}`);
    } else {
      await refetch();
    }
  };

  const handleMarkPending = async (id: string) => {
    const result = await updateBugReportStatus(id, 'pending');
    if (result.error) {
      alert(`Error: ${result.error.message}`);
    } else {
      await refetch();
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteBugReport(id);
    if (result.error) {
      alert(`Error: ${result.error.message}`);
    } else {
      await refetch();
    }
  };

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
      render: (value: string | undefined) => {
        const severity = value || 'low';
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
            severity === 'critical' ? 'bg-red-100 text-red-800' :
            severity === 'high' ? 'bg-orange-100 text-orange-800' :
            severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {severity.charAt(0).toUpperCase() + severity.slice(1)}
          </span>
        );
      },
    },
    {
      key: 'status' as keyof BugReport,
      label: 'Status',
      sortable: true,
      render: (value: string | undefined) => {
        const status = value || 'new';
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
            status === 'new' ? 'bg-blue-100 text-blue-800' :
            status === 'investigating' ? 'bg-purple-100 text-purple-800' :
            status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
            status === 'resolved' ? 'bg-green-100 text-green-800' :
            status === 'fixed' ? 'bg-emerald-100 text-emerald-800' :
            status === 'spam' ? 'bg-red-100 text-red-800' :
            status === 'read' ? 'bg-indigo-100 text-indigo-800' :
            status === 'pending' ? 'bg-yellow-200 text-yellow-900' :
            'bg-gray-100 text-gray-800'
          }`}>
            {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
          </span>
        );
      },
    },
    {
      key: 'created_at' as keyof BugReport,
      label: 'Date Created',
      sortable: true,
    },
    {
      key: 'actions' as keyof BugReport,
      label: 'Actions',
      sortable: false,
      render: (_: any, item: BugReport) => (
        <ActionButtons
          id={item.id}
          status={item.status || 'new'}
          onMarkFixed={handleMarkFixed}
          onMarkSpam={handleMarkSpam}
          onMarkRead={handleMarkRead}
          onMarkPending={handleMarkPending}
          onDelete={handleDelete}
        />
      ),
    },
  ];

  const filterOptions = [
    { value: 'active' as FilterType, label: 'Active', icon: Bug, count: data.filter(item => !['fixed', 'spam'].includes(item.status || 'new')).length },
    { value: 'fixed' as FilterType, label: 'Fixed', icon: CheckCircle2, count: data.filter(item => item.status === 'fixed').length },
    { value: 'spam' as FilterType, label: 'Spam', icon: AlertTriangle, count: data.filter(item => item.status === 'spam').length },
    { value: 'all' as FilterType, label: 'All', icon: Archive, count: data.length },
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
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {filterOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => setFilter(option.value)}
                    className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      filter === option.value
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {option.label}
                    <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                      filter === option.value
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {option.count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {filteredData.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm">
            <EmptyState type="bugs" />
          </div>
        ) : (
          <DataTable
            data={filteredData}
            columns={columns}
            emptyMessage={`No ${filter} bug reports found`}
          />
        )}
      </div>
    </div>
  );
};

export default BugReportsPage;