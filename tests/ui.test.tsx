import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

describe("ui components", () => {
	it("button renders and fires onClick", () => {
		const onClick = createSpy();

		render(<Button onClick={onClick}>Click me</Button>);

		const btn = screen.getByRole("button", { name: "Click me" });
		expect(btn).toBeTruthy();

		fireEvent.click(btn);
		expect(onClick.mock.calls.length).toBe(1);
	});

	it("button applies 'destructive' variant classes", () => {
		render(<Button variant="destructive">Delete</Button>);

		const btn = screen.getByRole("button", { name: "Delete" });
		// Check for a couple of expected classes from the variant
		const className = (btn as HTMLElement).className;
		expect(className.includes("bg-destructive")).toBe(true);
		expect(className.includes("text-white")).toBe(true);
	});

	it("input renders with type and updates value", () => {
		render(<Input type="email" placeholder="your@email.com" />);

		const input = screen.getByPlaceholderText("your@email.com");
		expect(input).toBeTruthy();
		expect((input as HTMLInputElement).type).toBe("email");

		fireEvent.change(input, { target: { value: "john@example.com" } });
		expect((input as HTMLInputElement).value).toBe("john@example.com");
	});

	it("badge renders with default variant classes", () => {
		render(<Badge>New</Badge>);

		const el = screen.getByText("New");
		const className = (el as HTMLElement).className;
		// Default variant includes bg-primary + text-primary-foreground
		expect(className.includes("bg-primary")).toBe(true);
		expect(className.includes("text-primary-foreground")).toBe(true);
	});

	it("card renders header, content and footer", () => {
		render(
			<Card>
				<CardHeader>
					<CardTitle>Title</CardTitle>
					<CardDescription>Subtitle</CardDescription>
				</CardHeader>
				<CardContent>Body content</CardContent>
				<CardFooter>Actions</CardFooter>
			</Card>,
		);

		expect(screen.getByText("Title")).toBeTruthy();
		expect(screen.getByText("Subtitle")).toBeTruthy();
		expect(screen.getByText("Body content")).toBeTruthy();
		expect(screen.getByText("Actions")).toBeTruthy();
	});

	it("label associates to input via htmlFor/id", () => {
		render(
			<div>
				<Label htmlFor="name">Name</Label>
				<Input id="name" />
			</div>,
		);

		// getByLabelText finds the associated input by the label content
		const input = screen.getByLabelText("Name");
		expect(input).toBeTruthy();
		expect((input as HTMLInputElement).id).toBe("name");
	});
});

function createSpy() {
	const fn: any = (...args: any[]) => {
		fn.mock.calls.push(args);
	};
	fn.mock = { calls: [] as any[] };
	return fn;
}
