<script>
    import { onMount } from "svelte";
    import { push } from "svelte-spa-router";
    import noteService from "../services/notes";
    import { fly } from "svelte/transition";

    import NoteCard from "../components/NoteCard.svelte";
    import * as notesIDB from "../data/notes";
    import { isOnline } from "../stores/connection.store";

    let notesList = [];

    const receiveNote = (note) => {
		if (notes.some(x => x._id === note._id)) {
			notes = notes.map(x => x._id === note._id ? note : x);
		} else {
			notes = notes.concat(note);
		}
	}

    // Separate async function to keep onMount synchronous.
    // See: https://github.com/sveltejs/svelte/issues/4927
    const loadNotes = async () => {
        notesList = (await notesIDB.getAll())
        console.table(notesList);
        notesList= notesList.filter(n => !n.deleted);
        console.log("Notes loaded!", notesList)
    };

    const fetchNotes = async () => {
        const fetchedNotes = await noteService.getNotes();
		if (fetchedNotes) {
			console.log('fetched notes:', fetchedNotes);
			notes = notes.concat(fetchedNotes);
		}
    };

    onMount(() => {
        loadNotes();
        //fetchNotes();
    });

    const removeNote = async (note) => {
        await notesIDB.deleteNote(note);

        notesList = notesList.filter(n => n.id !== parseInt(note.id));
    };

    const synchronize = async () => {
        noteService.synchronize(notesList);
    };
</script>

<div class="p-4">
    <div class="flex justify-between mb-3">
        <h1 class="text-3xl">Notes</h1>
        { #if !$isOnline }
        <div class="flex text-gray-600">
            <svg class="w-6 h-6 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
            <p>Offline</p> 
        </div>
        { /if }
        <button class="bg-blue-500 text-white px-4 py-2 rounded-2xl hover:bg-blue-700 duration-75"
            on:click={() => push("/note")}>
            New note
        </button>
    </div>
    
    { #each notesList as note }
    <div in:fly={{ y: 60 }} >
        <NoteCard {note}
                  removeNote={removeNote}/>
    </div>
    { /each }
    { #if notesList.length === 0} 
    <p class="my-4">No notes.</p>
    { /if }
</div>
<!--
<div class="absolute right-1 bottom-1 flex">
    <p class="mr-2">Online</p>
    <input type="checkbox" bind:checked={ $isOnline }/>
</div>
-->