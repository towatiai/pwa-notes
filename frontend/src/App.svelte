<script>
	import "./tailwind.css";
	import Editor from "@tinymce/tinymce-svelte";

	export let name;
</script>

<main>
	<h1 class="bg-black text-white">Editor</h1>
	<Editor 
		apiKey="v34y02hyvtu5epc1jl8he4fnk802k38gbu48ae0o7ld2zqod"
	/>
</main>

<style>
	main {
		text-align: center;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
