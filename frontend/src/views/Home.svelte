<script>
    import { onMount } from "svelte";
    import { push } from "svelte-spa-router";
    import { fly } from "svelte/transition";

    import NoteCard from "../components/NoteCard.svelte";
    import * as notes from "../data/notes";

    let notesList = [];

    // Separate async function to keep onMount synchronous.
    // See: https://github.com/sveltejs/svelte/issues/4927
    const loadNotes = async () => {
        notesList = await notes.getAll();
        console.log("Notes loaded!", notesList)
    };

    onMount(() => {
        loadNotes();
    });

    const removeNote = async (id) => {
        await notes.deleteById(id);

        notesList = notesList.filter(note => note.id !== parseInt(id));
    }
</script>

<div class="p-4">
    <div class="flex justify-between mb-3">
        <h1 class="text-3xl">Notes</h1>
        <button class="bg-blue-500 text-white px-4 py-2 rounded-2xl hover:bg-blue-700 duration-75"
            on:click={() => push("/note")}>
            New note
        </button>
    </div>
    
    { #each notesList as note }
    <div in:fly={{ y: 60 }} >
        <NoteCard title={note.title} content={note.content} id={note.id} removeNote={removeNote}/>
    </div>
    { /each }
    { #if notesList.length === 0} 
    <p class="my-4">No notes.</p>
    { /if }
</div>