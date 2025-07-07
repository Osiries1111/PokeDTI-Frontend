import { createContext } from 'react';
import type { User } from './authTypes';
export interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
  currentUser: User | null;
  refreshCurrentUser: () => void;
  scope: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;