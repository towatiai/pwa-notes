import App from './App.svelte';
import { handleConnection } from "./stores/connection.store";

// Adds connection handlers
window.addEventListener("online", handleConnection);
window.addEventListener("offline", handleConnection);

const app = new App({
	target: document.body
});

export default app;