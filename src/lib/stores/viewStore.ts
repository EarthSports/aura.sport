import { writable } from 'svelte/store';

// This store will hold the current view state ('team' or 'individual')
// It can be accessed and updated from any component in the app.
export const analysisView = writable('team');
