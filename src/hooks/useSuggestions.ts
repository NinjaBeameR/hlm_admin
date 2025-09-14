import { useState, useEffect } from 'react';
import { fetchSuggestions } from '../utils/supabase';
import type { Suggestion, DatabaseError } from '../types';

export const useSuggestions = () => {
  const [data, setData] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<DatabaseError | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    const result = await fetchSuggestions();
    
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