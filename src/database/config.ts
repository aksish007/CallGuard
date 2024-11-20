import SQLite from 'react-native-sqlite-storage';

// Enable debug mode for development
SQLite.DEBUG(true);
// Use WebSQL as a fallback for platforms that don't support SQLite
SQLite.enablePromise(true);

const database_name = "CallGuard.db";
const database_version = "1.0";
const database_displayname = "CallGuard SQLite Database";
const database_size = 200000;

export const getDBConnection = async () => {
    try {
        const db = await SQLite.openDatabase({
            name: database_name,
            location: 'default',
        });
        console.log("Database connected!");
        return db;
    } catch (error) {
        console.error("Error opening database:", error);
        throw Error('Failed to open database');
    }
};

export const initDatabase = async () => {
    try {
        const db = await getDBConnection();
        
        // Create Users table
        await db.executeSql(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                name TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_login TIMESTAMP,
                refresh_token TEXT
            );
        `);
        
        // Create Groups table
        await db.executeSql(`
            CREATE TABLE IF NOT EXISTS groups (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            );
        `);

        // Create Contacts table
        await db.executeSql(`
            CREATE TABLE IF NOT EXISTS contacts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                phone_number TEXT NOT NULL,
                name TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            );
        `);

        // Create GroupContacts junction table
        await db.executeSql(`
            CREATE TABLE IF NOT EXISTS group_contacts (
                group_id INTEGER,
                contact_id INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (group_id, contact_id),
                FOREIGN KEY (group_id) REFERENCES groups (id) ON DELETE CASCADE,
                FOREIGN KEY (contact_id) REFERENCES contacts (id) ON DELETE CASCADE
            );
        `);

        // Create BlockingSchedule table
        await db.executeSql(`
            CREATE TABLE IF NOT EXISTS blocking_schedules (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                group_id INTEGER,
                start_time TEXT,
                end_time TEXT,
                days_of_week TEXT,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (group_id) REFERENCES groups (id) ON DELETE CASCADE
            );
        `);

        console.log("Database initialized successfully!");
        return db;
    } catch (error) {
        console.error("Database initialization error:", error);
        throw Error('Failed to initialize database');
    }
};
