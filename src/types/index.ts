export interface User {
  id: string;
  email: string;
}

export interface BugReport {
  id: string;
  title: string;
  description: string;
  severity: string;
  status: string;
  created_at: string;
}

export interface Suggestion {
  id: string;
  description: string;
  created_at: string;
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