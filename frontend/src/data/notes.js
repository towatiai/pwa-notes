import { openDB, deleteDB, wrap, unwrap } from 'idb';

const DB_NAME = "notes-db";
const STORE_NAME = "notes";

let db = null;

export async function init() {
    if (!('indexedDB' in window)) {
        console.log('This browser doesn\'t support IndexedDB');
        return;
    }

    db = await openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, {
                    keyPath: 'id',
                    autoIncrement: true
                });
                console.log("IndexedDB created.")
            }
            
        }
    });

    console.log("IndexedDB initialized.");
}

export const add = async (note) => {
    return await db.add(STORE_NAME, note);
}

export const put = async (note) => {
    return await db.put(STORE_NAME, note);
}

export const getById = async (id) => {
    console.log("Fetching by id: ", {id})
    return await db.get(STORE_NAME, parseInt(id));
}

export const deleteById = async (id) => {
    console.log("Fetching by id: ", {id})
    return await db.delete(STORE_NAME, parseInt(id));
}

export const getAll = async () => {
    console.log("Reading...");
    return await db.getAll(STORE_NAME);
}