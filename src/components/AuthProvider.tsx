import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useAuthInitialization } from '@/hooks/useAuthInitialization';

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    useAuthInitialization();

    const isInitialized = useSelector((state: RootState) => state.auth.isInitialized);

    // Show loading screen while initializing
    if (!isInitialized) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    return <>{children}</>;
};