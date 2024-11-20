import { getDBConnection } from './config';

export interface Group {
    id?: number;
    name: string;
    is_active: boolean;
    created_at?: string;
}

export interface Contact {
    id?: number;
    phone_number: string;
    name?: string;
    created_at?: string;
}

export interface BlockingSchedule {
    id?: number;
    group_id: number;
    start_time: string;
    end_time: string;
    days_of_week: string;
    is_active: boolean;
    created_at?: string;
}

// Group operations
export const createGroup = async (group: Omit<Group, 'id' | 'created_at'>) => {
    try {
        const db = await getDBConnection();
        const result = await db.executeSql(
            'INSERT INTO groups (name, is_active) VALUES (?, ?)',
            [group.name, group.is_active]
        );
        return result[0].insertId;
    } catch (error) {
        console.error('Error creating group:', error);
        throw error;
    }
};

export const getGroups = async () => {
    try {
        const db = await getDBConnection();
        const results = await db.executeSql('SELECT * FROM groups ORDER BY created_at DESC');
        return results[0].rows.raw();
    } catch (error) {
        console.error('Error getting groups:', error);
        throw error;
    }
};

export const updateGroup = async (group: Group) => {
    try {
        const db = await getDBConnection();
        await db.executeSql(
            'UPDATE groups SET name = ?, is_active = ? WHERE id = ?',
            [group.name, group.is_active, group.id]
        );
    } catch (error) {
        console.error('Error updating group:', error);
        throw error;
    }
};

export const deleteGroup = async (groupId: number) => {
    try {
        const db = await getDBConnection();
        await db.executeSql('DELETE FROM groups WHERE id = ?', [groupId]);
    } catch (error) {
        console.error('Error deleting group:', error);
        throw error;
    }
};

// Contact operations
export const addContactToGroup = async (groupId: number, contact: Contact) => {
    try {
        const db = await getDBConnection();
        
        // First insert or get the contact
        let contactId;
        const existingContact = await db.executeSql(
            'SELECT id FROM contacts WHERE phone_number = ?',
            [contact.phone_number]
        );
        
        if (existingContact[0].rows.length > 0) {
            contactId = existingContact[0].rows.item(0).id;
        } else {
            const newContact = await db.executeSql(
                'INSERT INTO contacts (phone_number, name) VALUES (?, ?)',
                [contact.phone_number, contact.name]
            );
            contactId = newContact[0].insertId;
        }

        // Then add to group_contacts
        await db.executeSql(
            'INSERT OR IGNORE INTO group_contacts (group_id, contact_id) VALUES (?, ?)',
            [groupId, contactId]
        );

        return contactId;
    } catch (error) {
        console.error('Error adding contact to group:', error);
        throw error;
    }
};

export const getGroupContacts = async (groupId: number) => {
    try {
        const db = await getDBConnection();
        const results = await db.executeSql(`
            SELECT c.* 
            FROM contacts c
            JOIN group_contacts gc ON c.id = gc.contact_id
            WHERE gc.group_id = ?
            ORDER BY c.name, c.phone_number
        `, [groupId]);
        return results[0].rows.raw();
    } catch (error) {
        console.error('Error getting group contacts:', error);
        throw error;
    }
};

export const removeContactFromGroup = async (groupId: number, contactId: number) => {
    try {
        const db = await getDBConnection();
        await db.executeSql(
            'DELETE FROM group_contacts WHERE group_id = ? AND contact_id = ?',
            [groupId, contactId]
        );
    } catch (error) {
        console.error('Error removing contact from group:', error);
        throw error;
    }
};

// Blocking Schedule operations
export const createBlockingSchedule = async (schedule: Omit<BlockingSchedule, 'id' | 'created_at'>) => {
    try {
        const db = await getDBConnection();
        const result = await db.executeSql(
            'INSERT INTO blocking_schedules (group_id, start_time, end_time, days_of_week, is_active) VALUES (?, ?, ?, ?, ?)',
            [schedule.group_id, schedule.start_time, schedule.end_time, schedule.days_of_week, schedule.is_active]
        );
        return result[0].insertId;
    } catch (error) {
        console.error('Error creating blocking schedule:', error);
        throw error;
    }
};

export const getGroupSchedules = async (groupId: number) => {
    try {
        const db = await getDBConnection();
        const results = await db.executeSql(
            'SELECT * FROM blocking_schedules WHERE group_id = ? ORDER BY created_at DESC',
            [groupId]
        );
        return results[0].rows.raw();
    } catch (error) {
        console.error('Error getting group schedules:', error);
        throw error;
    }
};
