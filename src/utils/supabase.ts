import { createClient } from '@supabase/supabase-js';
import type { BugReport, Suggestion, DatabaseError, ReportFormData } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// File upload function
export const uploadScreenshot = async (file: File): Promise<{ url: string | null; error: DatabaseError | null }> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `screenshots/${fileName}`;

    const { error } = await supabase.storage
      .from('screenshots')
      .upload(filePath, file);

    if (error) {
      return {
        url: null,
        error: {
          message: 'Failed to upload screenshot',
          code: error.message
        }
      };
    }

    const { data: { publicUrl } } = supabase.storage
      .from('screenshots')
      .getPublicUrl(filePath);

    return { url: publicUrl, error: null };
  } catch (err) {
    return {
      url: null,
      error: {
        message: 'Network error while uploading screenshot'
      }
    };
  }
};

// Submit report function (public)
export const submitReport = async (formData: ReportFormData): Promise<{ error: DatabaseError | null }> => {
  try {
    let screenshotUrl = null;

    // Upload screenshot if provided
    if (formData.screenshot) {
      const uploadResult = await uploadScreenshot(formData.screenshot);
      if (uploadResult.error) {
        return { error: uploadResult.error };
      }
      screenshotUrl = uploadResult.url;
    }

    if (formData.type === 'bug') {
      const { error } = await supabase
        .from('bug_reports')
        .insert({
          description: formData.description,
          app_version: formData.app_version || null,
          screenshot_url: screenshotUrl,
          status: 'new'
        });

      if (error) {
        return {
          error: {
            message: 'Failed to submit bug report',
            code: error.code
          }
        };
      }
    } else {
      const { error } = await supabase
        .from('suggestions')
        .insert({
          description: formData.description,
          screenshot_url: screenshotUrl
        });

      if (error) {
        return {
          error: {
            message: 'Failed to submit suggestion',
            code: error.code
          }
        };
      }
    }

    return { error: null };
  } catch (err) {
    return {
      error: {
        message: 'Network error while submitting report'
      }
    };
  }
};

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

// Admin Database query functions (authenticated only)
export const fetchBugReports = async (): Promise<{ data: BugReport[] | null; error: DatabaseError | null }> => {
  try {
    const { data, error } = await supabase
      .from('bug_reports')
      .select('id, description, app_version, screenshot_url, created_at, status')
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
  } catch {
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
      .select('id, description, screenshot_url, created_at')
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
  } catch {
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
  } catch {
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
  } catch {
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
  } catch {
    return { 
      error: { 
        message: 'Network error while deleting suggestion' 
      } 
    };
  }
};