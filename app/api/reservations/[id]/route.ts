import type { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import z from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { reservations, statusEnum } from "@/lib/db/schema";

const statusSchema = z.object({
	status: z.enum(statusEnum.enumValues),
});

export async function PATCH(
	request: NextRequest,
	ctx: RouteContext<"/api/reservations/[id]">,
) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return Response.json({ message: "Unauthorized" }, { status: 401 });
	}

	const { id } = await ctx.params;
	const { data, error } = statusSchema.safeParse(await request.json());

	if (error) {
		return Response.json(
			{ message: "Bad request", issues: error.issues },
			{ status: 400 },
		);
	}

	try {
		await db
			.update(reservations)
			.set({ status: data.status })
			.where(eq(reservations.id, Number(id)));

		return new Response(null, { status: 204 });
	} catch {
		return Response.json(
			{ message: "Failed to update reservation" },
			{ status: 500 },
		);
	}
}
