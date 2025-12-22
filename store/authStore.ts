import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '../types';

interface Organization {
  id: string | number;
  name: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  organization: Organization | null;
  isLoading: boolean;
  _hasHydrated: boolean;
  login: (user: User, token: string, organization?: Organization) => void;
  logout: () => void;
  setToken: (token: string) => void;
  setOrganization: (organization: Organization) => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      organization: null,
      isLoading: false,
      _hasHydrated: false,
      login: (user, token, organization) => set({ user, token, organization: organization || null }),
      logout: () => set({ user: null, token: null, organization: null }),
      setToken: (token) => set({ token }),
      setOrganization: (organization) => set({ organization }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
