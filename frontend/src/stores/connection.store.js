import {writable} from "svelte/store";

export const isOnline = writable(navigator.onLine);

export const handleConnection = () => {
    console.log("Connection changed.", navigator.onLine ? "Online" : "Offline");
}