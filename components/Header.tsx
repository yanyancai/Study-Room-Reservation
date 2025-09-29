"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth/client";
import ThemeToggle from "./ThemeToggle";
import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function Header() {
	const { data } = authClient.useSession();

	return (
		<header className="border-border bg-card border-b">
			<div className="container mx-auto px-4 py-4">
				<div className="flex items-center justify-between">
					<Link className="flex items-center gap-x-2" href="/">
						<div className="bg-primary flex size-8 items-center justify-center rounded-md">
							<span className="text-primary-foreground text-sm font-bold">
								SR
							</span>
						</div>

						<h1 className="text-foreground text-xl font-semibold">
							StudyRoom
						</h1>
					</Link>

					<div className="flex items-center gap-x-2">
						{data?.user ? (
							<DropdownMenu>
								<DropdownMenuTrigger className="group flex items-center">
									<span className="text-sm font-medium">
										{data.user.name}
									</span>
									<ChevronRight className="ml-1 size-4 transition-[rotate] group-data-[state=open]:rotate-90" />
								</DropdownMenuTrigger>

								<DropdownMenuContent>
									<DropdownMenuLabel>
										{data.user.email}
									</DropdownMenuLabel>

									<DropdownMenuItem>
										<Link href="/book">
											Booking
										</Link>
									</DropdownMenuItem>

									<DropdownMenuItem>
										<Link href="/reservations">
											My Reservations
										</Link>
									</DropdownMenuItem>

									<DropdownMenuSeparator />

									<DropdownMenuItem
										onClick={() => authClient.signOut()}
									>
										Sign Out
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						) : (
							<Button
								size="sm"
								onClick={() =>
									authClient.signIn.social({
										provider: "microsoft",
									})
								}
							>
								Sign In
							</Button>
						)}

						<div className="bg-border h-6 w-px"></div>

						<ThemeToggle />
					</div>
				</div>
			</div>
		</header>
	);
}
