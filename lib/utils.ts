import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export async function fetcher(...args: Parameters<typeof fetch>) {
	return await fetch(...args).then((response) => response.json());
}

export const isValidRange = (start: Date, end: Date) =>
	start.getTime() < end.getTime();

export const overlaps = (a0: Date, a1: Date, b0: Date, b1: Date) =>
	isValidRange(a0, a1) && isValidRange(b0, b1) && a0 < b1 && b0 < a1;

export const slotsBetween = (start: Date, end: Date, minutes: number) => {
	const out: Date[] = [];
	const step = minutes * 60_000;
	for (let t = start.getTime(); t < end.getTime(); t += step) {
		out.push(new Date(t));
	}
	return out;
};

export const isCapacityOk = (capacity: number, partySize: number) =>
	partySize <= capacity;

export const durationMinutes = (start: Date, end: Date) =>
	Math.trunc((end.getTime() - start.getTime()) / 60_000);
