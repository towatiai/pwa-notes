<script>
	import "../tailwind.css";
	import Editor from "@tinymce/tinymce-svelte";
	import noteService from "../services/notes";

    export let close;
    export let passNote;
    export let note;
	let title = note ? note.title : '';
	let content = note ? note.content : '';

    const create = async () => {
        if (!title || !content) {
            console.log('something is missing');
            return;
        }
        const newNote = {
            title,
            content,
        };
        const createdNote = await noteService.createNote(newNote);
        if (createdNote) {
            console.log(createdNote);
            passNote(createdNote);
            close();
        }
    }
    const edit = async () => {
        if (!title || !content || !note._id) {
            console.log('something is missing');
            return;
        }
        const newNote = {
            title,
            content,
        };
        const editedNote = await noteService.editNote(note._id, newNote);
        if (editedNote) {
            console.log(editedNote);
            passNote(editedNote);
            close();
        }
    }

</script>

<div class="new-note">
    <div class="modal bg-white rounded-lg shadow-md">
        <label class="title-label block text-gray-700 text-sm font-bold mb-2">
            Title
        </label>
        <input
            class="title-input shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Title"
            bind:value={title}>
        <label class="title-label block text-gray-700 text-sm font-bold mb-2">
            Content
        </label>
        <Editor
            ref="editor"
            bind:text={content}
            value={note ? note.content : ''}
            apiKey="v34y02hyvtu5epc1jl8he4fnk802k38gbu48ae0o7ld2zqod"
        />
        <button
            class="bg-red-500 hover:bg-red-700 text-white py-2 px-6 rounded"
            on:click={close()}>
            Cancel
        </button>
        <button
            class="bg-green-500 hover:bg-green-700 text-white py-2 px-6 rounded"
            on:click={note ? edit : create}>
            Submit
        </button>
    </div>
</div>

<style>
    .new-note {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 100;
        background-color: rgba(0, 0, 0, 0.4);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    :global(.tox-tinymce) {
        height: 300px !important;
    }

    .modal {
        min-width: 50%;
        padding: 40px 20px 10px;
    }

    .title-input {
        margin-bottom: 20px;
    }

    button {
		margin: 20px;
	}
</style>
