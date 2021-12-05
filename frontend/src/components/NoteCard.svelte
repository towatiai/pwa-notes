<script>
    import { push } from "svelte-spa-router";

    export let note;
    export let removeNote;

    const openNote = () => {
        if (note._id) {
            push(`/note/${note._id}`);
        } else {
            push(`/note/local/${note.id}`)
        }
        
    };
</script>

<div
    class="group bg-white px-4 py-3 rounded-lg border-l-8 cursor-pointer mb-2 border-blue-300"
    on:click={openNote}
>
    <div class="flex justify-between">
        {#if note.title}
            <h2 class="mb-1 truncate">{note.title}</h2>
        {:else}
            <h2 class="mb-1 text-gray-400">No title</h2>
        {/if}
        <button class="group-hover:opacity-100 opacity-0 duration-200 text-gray-400 hover:text-red-600"
            on:click|stopPropagation={() => removeNote(note)}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
            </svg>
        </button>
    </div>
    
    
    {#if note.content}
        <p class="truncate text-sm text-gray-700">{note.content}</p>
    {:else}
        <p class="text-sm text-gray-400">No content</p>
    {/if}
</div>
