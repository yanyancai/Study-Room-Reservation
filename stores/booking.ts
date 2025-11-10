import type { Building, Room } from "@/lib/db/schema";
import { create } from "zustand";

export type BookingStep = "location" | "details" | "confirmation";

export interface BookingState {
	step: BookingStep;
	building: Building | null;
	room: Room | null;
	start: Date | null;
	end: Date | null;
	name: string | null;
	description: string | null;
	inviteCode: string | null;
}

export interface BookingActions {
	setStep: (step: BookingStep) => void;
	setLocation: (building: Building, room: Room) => void;
	setStart: (start: Date) => void;
	setEnd: (end: Date) => void;
	setName: (name: string) => void;
	setDescription: (description: string) => void;
	setInviteCode: (code: string) => void;
	reset: () => void;
}

export type BookingStore = BookingState & BookingActions;

const defaultState: BookingState = {
	step: "location",
	building: null,
	room: null,
	start: null,
	end: null,
	name: null,
	description: null,
	inviteCode: null,
};

export const useBooking = create<BookingStore>((set, get) => ({
	...defaultState,
	setStep: (step) => set({ step }),
	setLocation: (building, room) => set({ building, room }),
	setStart: (start) => set({ start }),
	setEnd: (end) => {
		const start = get().start;

		if (!start) {
			throw new Error("Start date must be set before setting end date.");
		}

		if (end.getTime() < start.getTime()) {
			throw new Error("End date cannot be before start date.");
		}

		set({ end });
	},
	setName: (name) => set({ name }),
	setDescription: (description) => set({ description }),
	setInviteCode: (code) => set({ inviteCode: code }),
	reset: () => set(defaultState),
}));
