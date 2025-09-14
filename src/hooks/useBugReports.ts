import { useState, useEffect } from 'react';
import { fetchBugReports } from '../utils/supabase';
import type { BugReport, DatabaseError } from '../types';

export const useBugReports = () => {
  const [data, setData] = useState<BugReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<DatabaseError | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    const result = await fetchBugReports();
    
    if (result.error) {
      setError(result.error);
    } else {
      setData(result.data || []);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const refetch = () => {
    loadData();
  };

  return { data, loading, error, refetch };
};