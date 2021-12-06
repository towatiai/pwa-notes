import { openDB, deleteDB, wrap, unwrap } from 'idb';
import noteService from "../services/notes";
import {isOnline} from "../stores/connection.store";
import {get} from "svelte/store";

const DB_NAME = "notes-db";
const STORE_NAME = "notes_1";

// Version allows us to update the local database schema.
// Browser don't allow lower version numbers than they currently have,
// so this needs to be increased if we want to force updates.
const VERSION = 3;

let db = null;

export async function init() {
    if (!('indexedDB' in window)) {
        console.log('This browser doesn\'t support IndexedDB');
        return;
    }

    db = await openDB(DB_NAME, VERSION, {
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

    if (get(isOnline)) {
        await synchronize();
    }


    console.log("IndexedDB initialized.");
}

export async function synchronize() {
    const localNotes = await db.getAll(STORE_NAME);
    console.log(localNotes);

    // We synchronize those notes that have changed and not sent to server.
    let remoteNotes;
    try {
        remoteNotes = await noteService.synchronize(localNotes);
    } catch(e) {
        console.error(e);
        return;
    }
    

    console.table(remoteNotes.notes);
    console.log("Local notes");
    console.table(localNotes);

    const notesToAdd = remoteNotes.notes.filter(rnote => !localNotes.map(n => n._id).includes(rnote._id));
    const notesToUpdate = remoteNotes.notes.filter(rnote => localNotes.map(n => n._id).includes(rnote._id));
    const notesToDelete = remoteNotes.deletedNotes.map(n => n.id);

    const tx = db.transaction(STORE_NAME, "readwrite");
    await Promise.all([
        ...notesToAdd.map(note => tx.store.add(note)), // Adds new notes
        ...notesToUpdate.map(note => tx.store.put(note)), // Updates existing notes
        ...notesToDelete.map(nid => tx.store.delete(nid)),
        tx.done
    ]);
}

export const add = async (note) => {
    if (get(isOnline)) {
        const resultNote = await noteService.createNote(note);
        // Takes the mongodb id and assigns it to the local note.
        note._id = resultNote._id;
        note.hasChanged = false;
    }
    return await db.add(STORE_NAME, note);
}

export const put = async (note) => {
    if (get(isOnline)) {
        const result = note._id 
            ? await noteService.editNote(note._id, note)
            : await noteService.createNote(note);

        if (result && result._id) {
            console.log(result)
            note._id = result._id;
            note.hasChanged = false;
        }
    }
    
    return await db.put(STORE_NAME, note);
}

export const getById = async (id, useLocal) => {
    console.log("Fetching by id: ", {id})
    if (useLocal) {
        return await db.get(STORE_NAME, parseInt(id));    
    }
    return await db.getFromIndex(STORE_NAME, "mongoid", id);
    
}

export const deleteNote = async (note) => {
    
    if (note._id) {
        // Note has mongodb id = there is a version stored in the db
        if (get(isOnline)) {
            // We have connection, so we just delete the note
            noteService.deleteNote(note._id);
        } else {
            // We don't have connection, so instead of removing the note,
            // we need to mark it as deleted locally, so we can remove it 
            // when we have connection.
            note.deleted = true;
            note.hasChanged = true;
            return await db.put(STORE_NAME, note);
        }
    }

    // If note doesn't have mongodb id, we don't need to worry about the remote database
    // because the only copy is on our local database.
    return await db.delete(STORE_NAME, parseInt(note.id));
}

export const getAll = async () => {
    console.log("Reading...");
    return await db.getAll(STORE_NAME);
}