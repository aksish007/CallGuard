import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import bcrypt from 'bcryptjs';
import { getDBConnection } from '../database/config';

export interface User {
    id: number;
    email: string;
    name?: string;
    created_at: string;
    last_login?: string;
}

const SALT_ROUNDS = 10;
const AUTH_TOKEN_KEY = '@auth_token';
const USER_KEY = '@user_data';

export const signUp = async (email: string, password: string, name?: string): Promise<User> => {
    try {
        // Create Firebase user
        const userCredential = await auth().createUserWithEmailAndPassword(email, password);
        const firebaseUser = userCredential.user;

        // Hash password for local storage
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        // Store user in local database
        const db = await getDBConnection();
        const result = await db.executeSql(
            'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)',
            [email, passwordHash, name || null]
        );

        const userId = result[0].insertId;
        const user: User = {
            id: userId,
            email,
            name,
            created_at: new Date().toISOString()
        };

        // Store auth token
        await AsyncStorage.setItem(AUTH_TOKEN_KEY, await firebaseUser.getIdToken());
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));

        return user;
    } catch (error) {
        console.error('Error in signUp:', error);
        throw error;
    }
};

export const signIn = async (email: string, password: string): Promise<User> => {
    try {
        // Firebase authentication
        const userCredential = await auth().signInWithEmailAndPassword(email, password);
        const firebaseUser = userCredential.user;

        // Get user from local database
        const db = await getDBConnection();
        const result = await db.executeSql(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (result[0].rows.length === 0) {
            throw new Error('User not found in local database');
        }

        const user = result[0].rows.item(0);

        // Update last login
        await db.executeSql(
            'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
            [user.id]
        );

        // Store auth token
        await AsyncStorage.setItem(AUTH_TOKEN_KEY, await firebaseUser.getIdToken());
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));

        return user;
    } catch (error) {
        console.error('Error in signIn:', error);
        throw error;
    }
};

export const signOut = async (): Promise<void> => {
    try {
        await auth().signOut();
        await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
        await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
        console.error('Error in signOut:', error);
        throw error;
    }
};

export const getCurrentUser = async (): Promise<User | null> => {
    try {
        const userJson = await AsyncStorage.getItem(USER_KEY);
        return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
};

export const isAuthenticated = async (): Promise<boolean> => {
    try {
        const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
        const user = await getCurrentUser();
        return !!(token && user);
    } catch (error) {
        console.error('Error checking authentication:', error);
        return false;
    }
};

export const updateUserProfile = async (userId: number, updates: { name?: string }): Promise<User> => {
    try {
        const db = await getDBConnection();
        const updateFields: string[] = [];
        const values: any[] = [];

        if (updates.name !== undefined) {
            updateFields.push('name = ?');
            values.push(updates.name);
        }

        if (updateFields.length === 0) {
            throw new Error('No fields to update');
        }

        values.push(userId);
        await db.executeSql(
            `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
            values
        );

        const result = await db.executeSql('SELECT * FROM users WHERE id = ?', [userId]);
        const updatedUser = result[0].rows.item(0);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(updatedUser));

        return updatedUser;
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
};
