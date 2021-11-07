import { openDB, deleteDB, wrap, unwrap } from 'idb';
import noteService from "../services/notes";

const DB_NAME = "notes-db";
const STORE_NAME = "notes_1";

let db = null;

export async function init() {
    if (!('indexedDB' in window)) {
        console.log('This browser doesn\'t support IndexedDB');
        return;
    }

    db = await openDB(DB_NAME, 3, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, {
                    keyPath: 'id',
                    autoIncrement: true
                });

                // Adds an index for mongodb indexes.
                store.createIndex("mongoid", "_id", { unique: true });
                console.log("IndexedDB created.")
            }
            
        }
    });
    console.log(db.objectStoreNames);

    const [remoteNotes, localNotes ] = await Promise.all([
        noteService.getNotes(),
        db.getAllFromIndex(STORE_NAME, "mongoid")
    ]);

    console.log(remoteNotes);
    console.log(localNotes);

    const remoteNotesToAdd = remoteNotes.filter(rnote => !localNotes.map(n => n._id).includes(rnote._id));

    const remoteNotesToUpdate = remoteNotes.filter(rnote => localNotes.map(n => n._id).includes(rnote._id));
    remoteNotesToUpdate.forEach(rnote => rnote.id = localNotes.find(lnote => lnote._id === rnote._id).id);

    const tx = db.transaction(STORE_NAME, "readwrite");
    await Promise.all([
        ...remoteNotesToAdd.map(note => tx.store.add(note)),
        ...remoteNotesToUpdate.map(note => tx.store.put(note)),
        tx.done
    ]);

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
    return await db.delete(STORE_NAME, parseInt(id));
}

export const getAll = async () => {
    console.log("Reading...");
    return await db.getAll(STORE_NAME);
}