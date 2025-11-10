import type { NextRequest } from "next/server";
import { and, eq, gte, lt, or } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { reservations } from "@/lib/db/schema";

const reservationSchema = createInsertSchema(reservations, {
	startTime: z.iso.datetime(),
	endTime: z.iso.datetime(),
});

export async function GET(request: NextRequest) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return Response.json({ message: "Unauthorized" }, { status: 401 });
	}

	const userId = request.nextUrl.searchParams.get("userId");

	if (userId) {
		const rows = await db.query.reservations.findMany({
			with: {
				room: {
					with: {
						building: true,
					},
				},
			},
			where: eq(reservations.userId, userId),
		});

		return Response.json(rows);
	}

	return Response.json(db.select().from(reservations));
}

export async function POST(request: NextRequest) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return Response.json({ message: "Unauthorized" }, { status: 401 });
	}

	const body = await request.json();
	const { data, error } = reservationSchema.safeParse(body);

	if (error) {
		return Response.json(
			{ message: "Bad Request", issues: error.issues },
			{ status: 400 },
		);
	}

	const start = new Date(data.startTime);
	const end = new Date(data.endTime);

	const overlapping = await db
		.select()
		.from(reservations)
		.where(
			and(
				eq(reservations.roomId, data.roomId),
				or(
					and(
						gte(reservations.startTime, start),
						lt(reservations.startTime, end),
					),
					and(
						gte(reservations.endTime, start),
						lt(reservations.endTime, end),
					),
				),
			),
		);

	if (overlapping.length) {
		return Response.json(
			{ message: "Room already booked during this time range" },
			{ status: 409 },
		);
	}

	const [reservation] = await db
		.insert(reservations)
		.values({
			userId: session.user.id,
			roomId: data.roomId,
			startTime: start,
			endTime: end,
			name: data.name,
			description: data.description,
			inviteCode: data.inviteCode,
		})
		.returning();

	return Response.json(reservation, { status: 201 });
}
