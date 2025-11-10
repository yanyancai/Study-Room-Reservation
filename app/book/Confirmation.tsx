import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import useSWRMutation from "swr/mutation";
import Reservation from "@/components/Reservation";
import { authClient } from "@/lib/auth/client";
import { useBooking } from "@/stores/booking";

export default function Confirmation() {
	const router = useRouter();
	const booking = useBooking();
	const { trigger } = useSWRMutation("/api/reservations", reserve);
	const { data: auth } = authClient.useSession();

	const code = nanoid(16);

	useEffect(() => {
		booking.setInviteCode(code);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	async function reserve(url: string) {
		const response = await fetch(url, {
			method: "POST",
			body: JSON.stringify({
				userId: auth?.user.id,
				roomId: booking.room?.id,
				startTime: booking.start,
				endTime: booking.end,
				name: booking.name,
				description: booking.description,
				inviteCode: booking.inviteCode,
			}),
		});

		return response.json();
	}

	async function confirm() {
		await trigger();

		router.push("/reservations");
		booking.reset();

		toast.success("Reservation created", { richColors: true });
	}

	return (
		<div className="flex justify-center">
			<div className="flex flex-col gap-6">
				<hgroup className="flex max-w-md flex-col">
					<h2 className="text-3xl font-semibold">Confirmation</h2>

					<p className="text-muted-foreground mt-1 text-sm">
						Qui pariatur pariatur non anim ipsum laborum quis minim
						sint Lorem ullamco qui. Use the unique link to invite
						others to your reservation. The link will expire at the
						start of your reservation.
					</p>
				</hgroup>

				<div className="max-w-lg">
					{booking.building && booking.room && (
						<Reservation
							building={booking.building}
							room={booking.room}
							onConfirm={confirm}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
