import React, { useState } from 'react';
import { Bug, MessageSquare, LogOut, User, Shield, ExternalLink } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import DataTable from '../components/DataTable';
import ActionButtons from '../components/ActionButtons';
import EntryDetailsModal from '../components/EntryDetailsModal';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { useBugReports } from '../hooks/useBugReports';
import { useSuggestions } from '../hooks/useSuggestions';
import type { BugReport, Suggestion } from '../types';
import { supabase } from '../utils/supabase';

type TabType = 'bugs' | 'suggestions';

const AdminDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('bugs');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<BugReport | Suggestion | null>(null);
  
  const { data: bugReports, loading: bugsLoading, error: bugsError, refetch: refetchBugs } = useBugReports();
  const { data: suggestions, loading: suggestionsLoading, error: suggestionsError, refetch: refetchSuggestions } = useSuggestions();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Action handlers for bug reports
  const handleMarkFixed = async (id: string) => {
    await supabase.from('bug_reports').update({ status: 'Fixed' }).eq('id', id);
    refetchBugs();
  };

  const handleMarkSpam = async (id: string) => {
    await supabase.from('bug_reports').update({ status: 'Spam' }).eq('id', id);
    refetchBugs();
  };

  const handleMarkRead = async (id: string) => {
    await supabase.from('bug_reports').update({ status: 'Read' }).eq('id', id);
    refetchBugs();
  };

  const handleMarkPending = async (id: string) => {
    await supabase.from('bug_reports').update({ status: 'Pending' }).eq('id', id);
    refetchBugs();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('bug_reports').delete().eq('id', id);
    refetchBugs();
  };

  // Action handlers for suggestions
  const handleSuggestionMarkRead = async (id: string) => {
    await supabase.from('suggestions').update({ status: 'Read' }).eq('id', id);
    refetchSuggestions();
  };

  const handleSuggestionMarkPending = async (id: string) => {
    await supabase.from('suggestions').update({ status: 'Pending' }).eq('id', id);
    refetchSuggestions();
  };

  const handleSuggestionDelete = async (id: string) => {
    await supabase.from('suggestions').delete().eq('id', id);
    refetchSuggestions();
  };

  const bugColumns = [
    {
      key: 'description' as keyof BugReport,
      label: 'Description',
      sortable: true,
      render: (value: string, item: BugReport) => (
        <div className="max-w-md">
          <p className="truncate" title={value}>
            {value}
          </p>
          {item.screenshot_url && (
            <a
              href={item.screenshot_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 mt-1"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Screenshot
            </a>
          )}
        </div>
      ),
    },
    {
      key: 'app_version' as keyof BugReport,
      label: 'App Version',
      sortable: true,
      render: (value: string) => value || '-',
    },
    {
      key: 'status' as keyof BugReport,
      label: 'Status',
      sortable: true,
      render: (value: string) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value === 'Fixed' ? 'bg-green-100 text-green-800' :
          value === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
          value === 'Read' ? 'bg-blue-100 text-blue-800' :
          value === 'Spam' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value || 'New'}
        </span>
      ),
    },
    {
      key: 'created_at' as keyof BugReport,
      label: 'Date Submitted',
      sortable: true,
      render: (value: string) => formatDate(value),
    },
    {
      key: 'actions' as keyof BugReport,
      label: 'Actions',
      render: (value: any, item: BugReport) => (
        <ActionButtons
          id={item.id}
          status={item.status || 'New'}
          onMarkFixed={handleMarkFixed}
          onMarkSpam={handleMarkSpam}
          onMarkRead={handleMarkRead}
          onMarkPending={handleMarkPending}
          onDelete={handleDelete}
          onViewDetails={() => {
            setSelectedEntry(item);
            setModalOpen(true);
          }}
        />
      ),
    },
  ];

  const suggestionColumns = [
    {
      key: 'description' as keyof Suggestion,
      label: 'Description',
      sortable: true,
      render: (value: string, item: Suggestion) => (
        <div className="max-w-md">
          <p className="truncate" title={value}>
            {value}
          </p>
          {item.screenshot_url && (
            <a
              href={item.screenshot_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 mt-1"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Screenshot
            </a>
          )}
        </div>
      ),
    },
    {
      key: 'status' as keyof Suggestion,
      label: 'Status',
      sortable: true,
      render: (value: string) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value === 'Read' ? 'bg-blue-100 text-blue-800' :
          value === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value || 'New'}
        </span>
      ),
    },
    {
      key: 'created_at' as keyof Suggestion,
      label: 'Date Submitted',
      sortable: true,
      render: (value: string) => formatDate(value),
    },
    {
      key: 'actions' as keyof Suggestion,
      label: 'Actions',
      render: (value: any, item: Suggestion) => (
        <ActionButtons
          id={item.id}
          status={item.status || 'New'}
          onMarkFixed={() => Promise.resolve()} // Not applicable for suggestions
          onMarkSpam={() => Promise.resolve()} // Not applicable for suggestions
          onMarkRead={handleSuggestionMarkRead}
          onMarkPending={handleSuggestionMarkPending}
          onDelete={handleSuggestionDelete}
          onViewDetails={() => {
            setSelectedEntry(item);
            setModalOpen(true);
          }}
        />
      ),
    },
  ];

  const tabs = [
    {
      id: 'bugs' as TabType,
      label: 'Bug Reports',
      icon: Bug,
      count: bugReports.length,
      color: 'text-red-600',
    },
    {
      id: 'suggestions' as TabType,
      label: 'Suggestions',
      icon: MessageSquare,
      count: suggestions.length,
      color: 'text-green-600',
    },
  ];

  const renderContent = () => {
    if (activeTab === 'bugs') {
      if (bugsLoading) {
        return <LoadingSpinner size="lg" text="Loading bug reports..." />;
      }
      
      if (bugsError) {
        return <ErrorMessage message={bugsError.message} onRetry={refetchBugs} />;
      }

      return bugReports.length === 0 ? (
        <EmptyState type="bugs" />
      ) : (
        <DataTable
          data={bugReports}
          columns={bugColumns}
          emptyMessage="No bug reports found"
        />
      );
    } else {
      if (suggestionsLoading) {
        return <LoadingSpinner size="lg" text="Loading suggestions..." />;
      }
      
      if (suggestionsError) {
        return <ErrorMessage message={suggestionsError.message} onRetry={refetchSuggestions} />;
      }

      return suggestions.length === 0 ? (
        <EmptyState type="suggestions" />
      ) : (
        <DataTable
          data={suggestions}
          columns={suggestionColumns}
          emptyMessage="No suggestions found"
        />
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* DEPLOYMENT TEST BANNER */}
      <div style={{ 
        background: 'linear-gradient(90deg, #ff0000, #ff8800, #ffff00)', 
        padding: '15px', 
        textAlign: 'center',
        fontSize: '18px',
        fontWeight: 'bold',
        color: 'white',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
      }}>
        🚀 DEPLOYMENT TEST 2025-09-14 13:45 - If you see this, the site is UPDATED! 🚀
      </div>
      
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and brand */}
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-slate-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>

            {/* User info and logout */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{user?.email}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
              >
                <LogOut className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Reports & Feedback</h2>
          <p className="text-gray-600 mt-2">
            Monitor and manage user-submitted bug reports and suggestions.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-slate-500 text-slate-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mr-2 ${activeTab === tab.id ? tab.color : ''}`} />
                    {tab.label}
                    <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                      activeTab === tab.id
                        ? 'bg-slate-100 text-slate-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm">
          {renderContent()}
        </div>
      </div>

      {/* Entry Details Modal */}
      {modalOpen && selectedEntry && (
        <EntryDetailsModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          entry={selectedEntry}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
