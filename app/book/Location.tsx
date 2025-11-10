import type { FullRoom } from "@/lib/db/schema";
import { useState } from "react";
import useSWR from "swr";
import Loading from "@/components/Loading";
import Reservation from "@/components/Reservation";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { fetcher } from "@/lib/utils";
import { useBooking } from "@/stores/booking";

function Intro() {
	return (
		<hgroup>
			<h2 className="text-3xl font-semibold">Location</h2>

			<p className="text-muted-foreground mt-1 max-w-prose text-sm">
				Qui pariatur pariatur non anim ipsum laborum quis minim sint
				Lorem ullamco qui. Voluptate esse eiusmod velit qui minim. Ut
				aute voluptate cupidatat ipsum ut pariatur laboris consequat
				occaecat aliqua ullamco dolor.
			</p>
		</hgroup>
	);
}

export default function Location() {
	const booking = useBooking();

	const [buildingFilter, setBuildingFilter] = useState("all");
	const [capacityFilter, setCapacityFilter] = useState("all");

	const { data: rooms = [], isLoading } = useSWR<FullRoom[]>(
		"/api/rooms",
		fetcher,
	);

	const buildings = rooms
		.map((room) => room.building)
		.filter((building, index, self) => {
			return index === self.findIndex((b) => b.id === building.id);
		});

	const filteredRooms = rooms.filter((room) => {
		if (
			buildingFilter !== "all" &&
			room.building.id !== Number(buildingFilter)
		) {
			return false;
		}

		if (capacityFilter !== "all") {
			const capacity = room.capacity ?? 0;

			switch (capacityFilter) {
				case "sm": {
					if (capacity > 4) return false;
					break;
				}

				case "md": {
					if (capacity <= 4 || capacity > 10) return false;
					break;
				}

				case "lg": {
					if (capacity <= 10) return false;
					break;
				}

				default:
					break;
			}
		}

		return true;
	});

	function selectRoom(room: FullRoom) {
		booking.setLocation(room.building, {
			...room,
			buildingId: room.building.id,
		});

		booking.setStep("details");
	}

	if (isLoading) {
		return (
			<>
				<Intro />
				<Loading />
			</>
		);
	}

	return (
		<div className="space-y-8">
			<Intro />

			<div className="flex flex-col gap-2 sm:flex-row">
				<Select
					value={buildingFilter}
					onValueChange={setBuildingFilter}
				>
					<SelectTrigger className="w-full sm:w-auto">
						<SelectValue placeholder="Filter building" />
					</SelectTrigger>

					<SelectContent>
						<SelectItem value="all">All buildings</SelectItem>

						{buildings.map((building) => (
							<SelectItem
								key={building.id}
								value={building.id.toString()}
							>
								{building.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select
					value={capacityFilter}
					onValueChange={setCapacityFilter}
				>
					<SelectTrigger className="w-full sm:w-auto">
						<SelectValue placeholder="Filter capacity" />
					</SelectTrigger>

					<SelectContent>
						<SelectItem value="all">All sizes</SelectItem>
						<SelectItem value="sm">Small (1-4)</SelectItem>
						<SelectItem value="md">Medium (4-10)</SelectItem>
						<SelectItem value="lg">Large (10+)</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="grid-auto grid gap-4">
				{filteredRooms.map((room) => (
					<Reservation
						key={room.id}
						building={room.building}
						room={room}
						onSelect={() => selectRoom(room)}
					/>
				))}
			</div>
		</div>
	);
}
