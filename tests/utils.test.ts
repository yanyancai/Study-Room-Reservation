import {
	cn,
	durationMinutes,
	isCapacityOk,
	isValidRange,
	overlaps,
	slotsBetween,
} from "@/lib/utils";

const d = (s: string) => new Date(s);

describe("utils", () => {
	it("cn: merges & filters (one test covers both behaviors)", () => {
		const out1 = cn("px-2", "text-sm", "text-lg");
		const out2 = cn(null as any, undefined as any, "", 0 as any, "block");
		expect(out1).toBe("px-2 text-lg");
		expect(out2).toBe("block");
	});

	it("isValidRange: true when start < end, false otherwise", () => {
		expect(
			isValidRange(d("2025-11-01T10:00Z"), d("2025-11-01T11:00Z")),
		).toBe(true);
		expect(
			isValidRange(d("2025-11-01T10:00Z"), d("2025-11-01T10:00Z")),
		).toBe(false);
		expect(
			isValidRange(d("2025-11-01T12:00Z"), d("2025-11-01T11:00Z")),
		).toBe(false);
	});

	it("overlaps: detects intersecting and non-intersecting ranges", () => {
		expect(
			overlaps(
				d("2025-11-01T10:00Z"),
				d("2025-11-01T11:00Z"),
				d("2025-11-01T11:00Z"),
				d("2025-11-01T12:00Z"),
			),
		).toBe(false);

		expect(
			overlaps(
				d("2025-11-01T10:00Z"),
				d("2025-11-01T12:00Z"),
				d("2025-11-01T11:00Z"),
				d("2025-11-01T13:00Z"),
			),
		).toBe(true);
	});

	it("slotsBetween: generates 30-minute slot boundaries", () => {
		const slots = slotsBetween(
			d("2025-11-01T10:00Z"),
			d("2025-11-01T11:30Z"),
			30,
		);
		expect(slots.map((s) => s.toISOString())).toEqual([
			"2025-11-01T10:00:00.000Z",
			"2025-11-01T10:30:00.000Z",
			"2025-11-01T11:00:00.000Z",
		]);
	});

	it("isCapacityOk: true when party fits, false otherwise", () => {
		expect(isCapacityOk(6, 6)).toBe(true);
		expect(isCapacityOk(6, 7)).toBe(false);
	});

	it("durationMinutes: returns whole-minute differences", () => {
		expect(
			durationMinutes(d("2025-11-01T10:00Z"), d("2025-11-01T11:15Z")),
		).toBe(75);
		expect(
			durationMinutes(d("2025-11-01T11:00Z"), d("2025-11-01T10:00Z")),
		).toBe(-60);
	});
});
