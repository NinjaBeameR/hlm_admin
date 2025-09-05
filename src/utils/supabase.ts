import { createClient } from '@supabase/supabase-js';
import type { BugReport, Suggestion, DatabaseError } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication functions
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    return { error: error.message };
  }
  
  return { user: data.user };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
};

// Database query functions
export const fetchBugReports = async (): Promise<{ data: BugReport[] | null; error: DatabaseError | null }> => {
  try {
    const { data, error } = await supabase
      .from('bug_reports')
      .select('id, title, description, severity, status, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      return { 
        data: null, 
        error: { 
          message: 'Failed to fetch bug reports', 
          code: error.code 
        } 
      };
    }

    return { data, error: null };
  } catch (err) {
    return { 
      data: null, 
      error: { 
        message: 'Network error while fetching bug reports' 
      } 
    };
  }
};

export const fetchSuggestions = async (): Promise<{ data: Suggestion[] | null; error: DatabaseError | null }> => {
  try {
    const { data, error } = await supabase
      .from('suggestions')
      .select('id, description, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      return { 
        data: null, 
        error: { 
          message: 'Failed to fetch suggestions', 
          code: error.code 
        } 
      };
    }

    return { data, error: null };
  } catch (err) {
    return { 
      data: null, 
      error: { 
        message: 'Network error while fetching suggestions' 
      } 
    };
  }
};

// Bug Report Actions
export const updateBugReportStatus = async (id: string, status: BugReport['status']): Promise<{ error: DatabaseError | null }> => {
  try {
    const { error } = await supabase
      .from('bug_reports')
      .update({ status })
      .eq('id', id);

    if (error) {
      return { 
        error: { 
          message: `Failed to update bug report status to ${status}`, 
          code: error.code 
        } 
      };
    }

    return { error: null };
  } catch (err) {
    return { 
      error: { 
        message: 'Network error while updating bug report' 
      } 
    };
  }
};

export const deleteBugReport = async (id: string): Promise<{ error: DatabaseError | null }> => {
  try {
    const { error } = await supabase
      .from('bug_reports')
      .delete()
      .eq('id', id);

    if (error) {
      return { 
        error: { 
          message: 'Failed to delete bug report', 
          code: error.code 
        } 
      };
    }

    return { error: null };
  } catch (err) {
    return { 
      error: { 
        message: 'Network error while deleting bug report' 
      } 
    };
  }
};

export const deleteSuggestion = async (id: string): Promise<{ error: DatabaseError | null }> => {
  try {
    const { error } = await supabase
      .from('suggestions')
      .delete()
      .eq('id', id);

    if (error) {
      return { 
        error: { 
          message: 'Failed to delete suggestion', 
          code: error.code 
        } 
      };
    }

    return { error: null };
  } catch (err) {
    return { 
      error: { 
        message: 'Network error while deleting suggestion' 
      } 
    };
  }
};