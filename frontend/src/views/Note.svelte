<script>
import { onMount } from "svelte";

	import { replace } from "svelte-spa-router";
	import * as notes from "../data/notes";
	export let params = {};
	let isNewNote = typeof params.id === "undefined";
	console.log(params);

	let topHeight = 0;
	let date = new Date();

	let note;

	const getNote = async () => {
		if (isNewNote) {
			note = {
				title: "",
				content: "",
			};
		} else {
			note = await notes.getById(params.id);
			console.log(note);
		}
	};

	const save = async () => {
		if (note.title || note.content) {
			if (isNewNote) {
				await notes.add(note);
			} else {
				await notes.put(note, params.id);
			}
		}
	}

	const goBack = async () => {
		replace("/");
	};

	let timerId = null;
	let saved = true;
	const autosave = () => {
		saved = false;
		if (timerId !== null) {
			clearTimeout(timerId);
		}
		timerId = setTimeout(() => {
			save();
			saved = true;
		}, 1500);
	}

</script>

{#await getNote()}
	Loading note...
{:then _}
	<div class="p-4 flex-col">
		<div bind:clientHeight={topHeight} class="mb-2">
			<div class="flex justify-between">
				<button
					class="hover:bg-blue-100 text-black p-1 -ml-1 mr-1 rounded-full"
					on:click={goBack}
				>
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
							d="M15 19l-7-7 7-7"
						/>
					</svg>
				</button>
				<div class="mt-1 flex">
					{ #if saved }
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 -mt-0.5 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
					  </svg>
					<p class="text-green-700">Saved</p>
					{ :else }
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-yellow-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
					  </svg>
					<p class="text-yellow-700">Not saved</p>
					{ /if }
				</div>
			</div>

			<div class="mt-2">
				<input
					bind:value={note.title}
					on:keyup={autosave}
					class="flex-none w-full rounded-lg bg-gray-100 text-2xl font-bold hide-outline"
					placeholder="Title..."
					type="text"
				/>
				<p class="text-gray-500 text-sm">
					{date.toLocaleString("en-US", {
						year: "numeric",
						month: "long",
						day: "numeric",
					})}
				</p>
			</div>
		</div>

		<textarea
			bind:value={note.content}
			on:keyup={autosave}
			class="w-full rounded-lg bg-gray-100 hide-outline"
			style="height: {window.innerHeight - topHeight - 24}px"
			placeholder="Write here..."
		/>

		<!-- 
	<Editor
		apiKey="v34y02hyvtu5epc1jl8he4fnk802k38gbu48ae0o7ld2zqod"
		conf={{
			menubar: false,
			height: window.innerHeight - topHeight - 24
		}}
	/>
	-->
	</div>
{/await}

<style>
	.hide-outline:focus-visible {
		outline: none;
	}
</style>
