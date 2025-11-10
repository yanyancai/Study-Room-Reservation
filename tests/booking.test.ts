import type { BookingStore } from "@/stores/booking";
import { act, renderHook } from "@testing-library/react";
import { useBooking } from "@/stores/booking";

describe("booking store", () => {
	let booking: { current: BookingStore };

	beforeEach(() => {
		const { result } = renderHook(() => useBooking());
		booking = result;
	});

	it("should set location correctly", () => {
		const building = { id: 1, name: "Main Building", image: "" };
		const room = {
			id: 1,
			name: "Conference Room",
			number: 101,
			capacity: 10,
			buildingId: 1,
		};

		act(() => {
			booking.current.setLocation(building, room);
		});

		expect(booking.current.building).toEqual(building);
		expect(booking.current.room).toEqual(room);
	});

	it("should error when setting end date without a start date", () => {
		expect(() => act(() => booking.current.setEnd(new Date()))).toThrow(
			"Start date must be set before setting end date.",
		);
	});

	it("should set start date correctly", () => {
		const startDate = new Date("2025-11-01T10:00:00");

		act(() => {
			booking.current.setStart(startDate);
		});

		expect(booking.current.start).toEqual(startDate);
	});

	it("should error when setting end date before start date", () => {
		const startDate = new Date("2025-11-01T10:00:00");
		const endDate = new Date("2025-11-01T09:00:00");

		act(() => {
			booking.current.setStart(startDate);
		});

		expect(() => act(() => booking.current.setEnd(endDate))).toThrow(
			"End date cannot be before start date.",
		);
	});

	it("should set end date correctly", () => {
		const endDate = new Date("2025-11-01T11:00:00");

		act(() => {
			booking.current.setEnd(endDate);
		});

		expect(booking.current.end).toEqual(endDate);
	});

	it("should set name correctly", () => {
		act(() => {
			booking.current.setName("Team Meeting");
		});

		expect(booking.current.name).toBe("Team Meeting");
	});

	it("should set description correctly", () => {
		act(() => {
			booking.current.setDescription("Weekly sync-up");
		});

		expect(booking.current.description).toBe("Weekly sync-up");
	});

	it("should set invite code correctly", () => {
		act(() => {
			booking.current.setInviteCode("INVITE123");
		});

		expect(booking.current.inviteCode).toBe("INVITE123");
	});
});
