import React from 'react';

// Temporary debug component - remove after fixing environment variables
const DebugInfo: React.FC = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const hasKey = !!import.meta.env.VITE_SUPABASE_ANON_KEY;

  return (
    <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
      <h3 className="font-bold">Debug Info</h3>
      <p><strong>Supabase URL:</strong> {supabaseUrl}</p>
      <p><strong>Has API Key:</strong> {hasKey ? 'Yes' : 'No'}</p>
      <p><strong>Expected URL:</strong> https://kvzhuiwqrvckfaweikhq.supabase.co</p>
      <p className={supabaseUrl?.includes('kvzhuiwqrvckfaweikhq') ? 'text-green-600' : 'text-red-600'}>
        <strong>Status:</strong> {supabaseUrl?.includes('kvzhuiwqrvckfaweikhq') ? '✅ Correct' : '❌ Wrong URL'}
      </p>
    </div>
  );
};

export default DebugInfo;
