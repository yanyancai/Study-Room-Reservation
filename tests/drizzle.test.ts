/**
 * @jest-environment node
 */

import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import process from "node:process";
import { addHours } from "date-fns";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { buildings, reservations, rooms, users } from "@/lib/db/schema";

const db = drizzle(process.env.TEST_DATABASE_URL!);

async function insertBuilding(name = `B-${randomUUID().slice(0, 8)}`) {
	const [building] = await db
		.insert(buildings)
		.values({ name, image: "" })
		.returning();

	return building;
}

async function insertRoom(buildingId: number, number = 101, capacity = 6) {
	const [room] = await db
		.insert(rooms)
		.values({ number, capacity, buildingId })
		.returning();

	return room;
}

async function insertUser(email = `u_${randomUUID().slice(0, 8)}@ex.com`) {
	const id = randomUUID();

	const [user] = await db
		.insert(users)
		.values({
			id,
			name: "Test User",
			email,
			emailVerified: false,
		})
		.returning();

	return user;
}

async function insertReservation(args: {
	userId: string;
	roomId: number;
	name?: string;
	description?: string | null;
	inviteCode?: string;
	start?: Date;
	end?: Date;
}) {
	const now = new Date();

	const [reservation] = await db
		.insert(reservations)
		.values({
			userId: args.userId,
			roomId: args.roomId,
			name: args.name ?? "Team Meeting",
			description: args.description ?? null,
			inviteCode:
				args.inviteCode ?? randomUUID().replace(/-/g, "").slice(0, 16),
			startTime: args.start ?? addHours(now, 1),
			endTime: args.end ?? addHours(now, 2),
		})
		.returning();

	return reservation;
}

describe("drizzle integration", () => {
	beforeAll(() => {
		execSync("pnpm drizzle-kit push --config=drizzle-test.config.ts");
	});

	beforeEach(async () => {
		await db.delete(reservations);
		await db.delete(rooms);
		await db.delete(buildings);
		await db.delete(users);
	});

	it("inserts and selects building and room with join", async () => {
		const b = await insertBuilding("Main");
		const r = await insertRoom(b.id, 203, 8);

		const rows = await db
			.select({
				roomId: rooms.id,
				roomNumber: rooms.number,
				buildingName: buildings.name,
			})
			.from(rooms)
			.leftJoin(buildings, eq(rooms.buildingId, buildings.id))
			.where(eq(rooms.id, r.id));

		expect(rows).toHaveLength(1);
		expect(rows[0].roomNumber).toBe(203);
		expect(rows[0].buildingName).toBe("Main");
	});

	it("creates a reservation linked to user and room", async () => {
		const b = await insertBuilding();
		const r = await insertRoom(b.id);
		const u = await insertUser();

		const res = await insertReservation({
			userId: u.id,
			roomId: r.id,
			name: "Planning",
		});

		const [fetched] = await db
			.select()
			.from(reservations)
			.where(eq(reservations.id, res.id));

		expect(fetched?.name).toBe("Planning");
		expect(fetched?.userId).toBe(u.id);
		expect(fetched?.roomId).toBe(r.id);
	});

	it("enforces unique invite_code on reservations", async () => {
		const b = await insertBuilding();
		const r = await insertRoom(b.id);
		const u = await insertUser();

		const code = "INV1234567890ABC";
		await insertReservation({
			userId: u.id,
			roomId: r.id,
			inviteCode: code,
		});

		await expect(
			insertReservation({ userId: u.id, roomId: r.id, inviteCode: code }),
		).rejects.toThrow();
	});

	it("cascades delete: removing user deletes their reservations", async () => {
		const b = await insertBuilding();
		const r = await insertRoom(b.id);
		const u = await insertUser();

		const res = await insertReservation({ userId: u.id, roomId: r.id });

		await db.delete(users).where(eq(users.id, u.id));

		const rows = await db
			.select()
			.from(reservations)
			.where(eq(reservations.id, res.id));

		expect(rows).toHaveLength(0);
	});

	it("cascades delete chain: removing building deletes rooms and reservations", async () => {
		const b = await insertBuilding();
		const r = await insertRoom(b.id);
		const u = await insertUser();

		const res = await insertReservation({ userId: u.id, roomId: r.id });

		await db.delete(buildings).where(eq(buildings.id, b.id));

		const roomRows = await db
			.select()
			.from(rooms)
			.where(eq(rooms.id, r.id));
		expect(roomRows).toHaveLength(0);

		const resRows = await db
			.select()
			.from(reservations)
			.where(eq(reservations.id, res.id));

		expect(resRows).toHaveLength(0);
	});

	it("sets created_at defaults on inserted entities", async () => {
		const u = await insertUser();
		const b = await insertBuilding();
		const r = await insertRoom(b.id);
		const res = await insertReservation({ userId: u.id, roomId: r.id });

		const [userRow] = await db
			.select()
			.from(users)
			.where(eq(users.id, u.id));

		const [resRow] = await db
			.select()
			.from(reservations)
			.where(eq(reservations.id, res.id));

		expect(userRow?.createdAt).toBeInstanceOf(Date);
		expect(resRow?.createdAt).toBeInstanceOf(Date);
	});
});
