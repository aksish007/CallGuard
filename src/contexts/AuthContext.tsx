import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, getCurrentUser, signIn, signUp, signOut, updateUserProfile } from '../services/auth';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, name?: string) => Promise<void>;
    signOut: () => Promise<void>;
    updateProfile: (updates: { name?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
            } catch (error) {
                console.error('Error initializing auth:', error);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const handleSignIn = async (email: string, password: string) => {
        try {
            const user = await signIn(email, password);
            setUser(user);
        } catch (error) {
            console.error('Error signing in:', error);
            throw error;
        }
    };

    const handleSignUp = async (email: string, password: string, name?: string) => {
        try {
            const user = await signUp(email, password, name);
            setUser(user);
        } catch (error) {
            console.error('Error signing up:', error);
            throw error;
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            setUser(null);
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    };

    const handleUpdateProfile = async (updates: { name?: string }) => {
        try {
            if (!user) throw new Error('No user logged in');
            const updatedUser = await updateUserProfile(user.id, updates);
            setUser(updatedUser);
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                signIn: handleSignIn,
                signUp: handleSignUp,
                signOut: handleSignOut,
                updateProfile: handleUpdateProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
