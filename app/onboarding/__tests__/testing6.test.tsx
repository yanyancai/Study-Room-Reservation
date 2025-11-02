import { render, screen, act } from "@testing-library/react";
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

describe("Onboarding Component - Step 6: logo changes to login version in Step 2", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test("displays login logo after step 2 transition", () => {
    render(<Onboarding />);

    const initialLogo = screen.getByAltText("StudyRez");
    expect(initialLogo).toHaveAttribute("src", "/Logoonboarding.svg");

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    const updatedLogo = screen.getByAltText("StudyRez");
    expect(updatedLogo).toHaveAttribute("src", "/Logologin.svg");
  });
});
