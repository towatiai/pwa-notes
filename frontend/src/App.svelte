<script>
	import "./tailwind.css";
	import Router from "svelte-spa-router";
	import Home from "./views/Home.svelte";
	import Note from "./views/Note.svelte";
	import { init } from "./data/notes";

	const initApp = async () => {
		await init();
	}

</script>

<main style="min-height: 100vh; max-width: 720px;" class="m-auto bg-gray-100">
	{ #await initApp() }
	<p>Loading...</p>
	{ :then value } 
	<Router routes={{
		'/': Home,
		'/note': Note,
		'/note/:id': Note,
		'/note/local/:id': Note
	}}/>
	{ :catch error }
	<p>{error}</p>
	{ /await }
</main> 
