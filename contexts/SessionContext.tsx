import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface SessionData {
  session_access_token: string | null;
  user_id: string | null;
  user_name: string | null;
  user_email: string | null;
  sessions_remaining: number | null;
  time_limit_minutes: number | null;
  session_type: string | null;
  cohort_name: string | null;
  original_token: string | null; // Store the original verification token
  // Setup data for AI session
  role_title?: string | null;
  job_description?: string | null;
}

interface SessionContextType {
  sessionData: SessionData | null;
  setSessionData: (data: SessionData | null) => void;
  clearSession: () => void;
  isSessionActive: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [sessionData, setSessionDataState] = useState<SessionData | null>(null);

  // Load session data from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('session_access_token');
    if (storedToken) {
      // Try to restore session data from localStorage
      const storedData = localStorage.getItem('session_data');
      if (storedData) {
        try {
          const parsed = JSON.parse(storedData);
          setSessionDataState({
            session_access_token: storedToken,
            ...parsed,
          });
        } catch (e) {
          // If parsing fails, clear everything
          localStorage.removeItem('session_access_token');
          localStorage.removeItem('session_data');
        }
      }
    }
  }, []);

  const setSessionData = (data: SessionData | null) => {
    setSessionDataState(data);
    if (data) {
      // Store token and data in localStorage
      if (data.session_access_token) {
        localStorage.setItem('session_access_token', data.session_access_token);
      }
      // Store other session data (excluding token)
      const { session_access_token, ...otherData } = data;
      localStorage.setItem('session_data', JSON.stringify(otherData));
    } else {
      // Clear from localStorage
      localStorage.removeItem('session_access_token');
      localStorage.removeItem('session_data');
    }
  };

  const clearSession = () => {
    setSessionDataState(null);
    localStorage.removeItem('session_access_token');
    localStorage.removeItem('session_data');
  };

  const isSessionActive = !!sessionData?.session_access_token;

  return (
    <SessionContext.Provider
      value={{
        sessionData,
        setSessionData,
        clearSession,
        isSessionActive,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}

