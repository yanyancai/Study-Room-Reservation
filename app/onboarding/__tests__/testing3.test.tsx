import { render, screen, act, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Onboarding from "../page";

jest.mock("next/image", () => (props: any) => (
  <img {...props} alt={props.alt || "mocked image"} />
));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

describe("Onboarding Component - Step 3: input updates school value", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test("updates input value when user types", () => {
    render(<Onboarding />);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    const input = screen.getByPlaceholderText("Search schools");
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "Wayne State University" } });

    expect(input).toHaveValue("Wayne State University");
  });
});
