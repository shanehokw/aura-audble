import { writable } from 'svelte/store';

export const token = writable<string>('');

export const setToken = (newToken: string) => {
	token.update(() => newToken);
};
