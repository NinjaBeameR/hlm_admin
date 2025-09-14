export interface User {
  id: string;
  email: string;
}

export interface BugReport {
  id: string;
  title?: string;
  description: string;
  severity?: string;
  status?: 'new' | 'investigating' | 'in_progress' | 'resolved' | 'fixed' | 'spam' | 'closed' | 'read' | 'pending';
  app_version?: string;
  screenshot_url?: string;
  created_at: string;
}

export interface Suggestion {
  id: string;
  description: string;
  status?: 'new' | 'read' | 'pending';
  screenshot_url?: string;
  created_at: string;
}

export interface ReportFormData {
  type: 'bug' | 'suggestion';
  description: string;
  screenshot?: File;
  app_version?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

export interface DatabaseError {
  message: string;
  code?: string;
}