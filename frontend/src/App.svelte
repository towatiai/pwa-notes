<script>
	import "./tailwind.css";
	import { onMount } from 'svelte';
	import noteService from "./services/notes";
	import Note from "./components/Note.svelte";

	let notes = [];
	let selectedNote;
	let editing = false;

	const receiveNote = (note) => {
		if (notes.some(x => x._id === note._id)) {
			notes = notes.map(x => x._id === note._id ? note : x);
		} else {
			notes = notes.concat(note);
		}
	}

	onMount(async () => {
		const fetchedNotes = await noteService.getNotes();
		if (fetchedNotes) {
			console.log('fetched notes:', fetchedNotes);
			notes = notes.concat(fetchedNotes);
		}
	})
</script>

<main class="bg-gray-100">
	<h1 class="bg-black text-white">Notes</h1>
	{#if editing}
		<Note
			close={() => {editing = false; selectedNote = null;}}
			passNote={receiveNote}
			note={selectedNote}
		/>
	{/if}
	<button
		class="bg-blue-500 hover:bg-blue-700 text-white py-2 px-6 rounded"
		on:click={() => {editing = true}}>
		Create new
	</button>
	<div class="notes">
		{#each notes as note}
			<div 
				class="note h-40 p-6 bg-white flex items-center rounded-lg shadow-md hover:scale-105 transition transform duration-500 cursor-pointer"
				on:click={() => {selectedNote = note; editing = true; console.log(note);}}>
				<div class="note-text">
					<h2 class="text-xl font-bold text-gray-700 mb-2">{note.title}</h2>
					<p class="text-gray-600 w-80 text-sm">{note.content}</p>
				</div>
			</div>
		{/each}
	</div>

</main>

<style>
	main {
		text-align: center;
		margin: 0 auto;
		font-family: system-ui;
		min-height: 100vh;
	}

	h1 {
		color: rgb(32, 255, 188);
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	.notes {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
	}

	.note {
		margin: 15px;
	}

	.note-text {
		overflow: hidden;
    	white-space: nowrap;
	}

	button {
		margin: 10px;
	}
</style>
