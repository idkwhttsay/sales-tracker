'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User, AuthContextType } from '@/lib/types';

const AuthContext = createContext<AuthContextType>({
    user: null,
    login: () => false,
    logout: () => {},
    loading: true
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check if user is already logged in (from localStorage)
        if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        }
    }, []);

    const login = (username: string, password: string): boolean => {
        const validUsername = process.env.NEXT_PUBLIC_USERNAME;
        const validPassword = process.env.NEXT_PUBLIC_PASSWORD;

        if (username === validUsername && password === validPassword) {
            const userData: User = { username };
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            router.push('/');
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
    {children}
    </AuthContext.Provider>
);
}

export const useAuth = () => useContext(AuthContext);