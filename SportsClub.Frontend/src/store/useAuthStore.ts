import { create } from 'zustand';
import type { User } from '../types/auth';
import { jwtDecode } from 'jwt-decode';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isAuthenticating: boolean;
    login: (token: string) => void;
    logout: () => void;
    checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    isAuthenticating: true, // Başlangıçta Auth durumu kontrol ediliyor varsayılır

    login: (token: string) => {
        localStorage.setItem('token', token);

        try {
            // Decode JWT to get user info 
            // Note: jwt-decode paketini yüklememiz gerekecek
            const decoded: any = jwtDecode(token);

            const user: User = {
                id: decoded.sub || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
                email: decoded.email || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
                firstName: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'] || '',
                lastName: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'] || '',
                roles: Array.isArray(decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'])
                    ? decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
                    : [decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']].filter(Boolean)
            };

            set({ token, isAuthenticated: true, isAuthenticating: false, user });
        } catch (e) {
            console.error('Invalid token', e);
            localStorage.removeItem('token');
            set({ token: null, isAuthenticated: false, isAuthenticating: false, user: null });
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false, isAuthenticating: false });
    },

    checkAuth: () => {
        const token = localStorage.getItem('token');
        if (token) {
            // Login metodunu tekrar çağırarak state'i doldur ve validity kontrolü yap
            useAuthStore.getState().login(token);
        } else {
            set({ isAuthenticated: false, isAuthenticating: false, user: null, token: null });
        }
    }
}));
