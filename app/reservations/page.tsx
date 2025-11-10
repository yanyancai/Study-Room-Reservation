"use client";

import type { FullReservation } from "@/lib/db/schema";
import { CalendarX2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import Loading from "@/components/Loading";
import Reservation from "@/components/Reservation";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { authClient } from "@/lib/auth/client";
import { fetcher } from "@/lib/utils";

export default function ReservationsPage() {
	const { data: auth, isPending } = authClient.useSession();

	const {
		data: reservations,
		isLoading,
		mutate,
	} = useSWR<FullReservation[]>(
		auth ? `/api/reservations?userId=${auth.user.id}` : null,
		fetcher,
	);

	const { trigger } = useSWRMutation<Response, any, string, number>(
		"/api/reservations",
		(url, { arg }) =>
			fetch(`${url}/${arg}`, {
				method: "PATCH",
				body: JSON.stringify({ status: "cancelled" }),
			}),
		{
			onSuccess() {
				mutate();
				toast.success("Reservation cancelled", { richColors: true });
			},
		},
	);

	if (isPending || isLoading) {
		return <Loading />;
	}

	if (!reservations?.length) {
		return (
			<div className="flex h-full items-center justify-center">
				<Empty>
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<CalendarX2 />
						</EmptyMedia>

						<EmptyTitle>No Reservations</EmptyTitle>

						<EmptyDescription>
							You haven't booked any reservations yet. Get started
							by creating your first reservation.
						</EmptyDescription>
					</EmptyHeader>

					<EmptyContent>
						<Button asChild>
							<Link href="/book">Book a Reservation</Link>
						</Button>
					</EmptyContent>
				</Empty>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-screen-sm px-4 pt-28">
			<h2 className="mb-8 text-3xl font-semibold">Your Reservations</h2>

			<div className="space-y-4">
				{reservations.map((reservation) => (
					<Reservation
						key={reservation.id}
						readonly
						building={reservation.room.building}
						room={reservation.room}
						reservation={reservation}
						onCancel={() => trigger(reservation.id)}
					/>
				))}
			</div>
		</div>
	);
}
