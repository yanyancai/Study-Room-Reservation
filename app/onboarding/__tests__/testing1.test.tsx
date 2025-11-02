import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Onboarding from "../page";

jest.mock("next/image", () => (props: any) => {
  return <img {...props} alt={props.alt || "mocked image"} />;
});

describe("Onboarding Component - Step 1", () => {
  test("should show Onboarding logo by default", () => {

    render(<Onboarding />);

    const logo = screen.getByAltText("StudyRez");

    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "/Logoonboarding.svg");

    expect(screen.queryByPlaceholderText("Search schools")).not.toBeInTheDocument();
  });
});

