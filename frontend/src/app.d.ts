import type PocketBase from 'pocketbase';

declare global {
	namespace App {
		interface Locals {
			pb: PocketBase;
			user: any; // ou Record<string, any> si tu veux
		}
	}
}

export {};
