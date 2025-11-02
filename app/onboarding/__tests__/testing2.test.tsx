import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import Onboarding from "../page";

jest.mock("next/image", () => (props: any) => {
  return <img {...props} alt={props.alt || "mocked image"} />;
});

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

describe("Onboarding Component - Step 2 Transition", () => {
  beforeAll(() => {
    jest.useFakeTimers(); 
  });

  afterAll(() => {
    jest.useRealTimers(); 
  });

  test("automatically switches to step 2 after 2 seconds", () => {
    
    render(<Onboarding />);
    expect(screen.getByAltText("StudyRez")).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    const input = screen.getByPlaceholderText("Search schools");
    expect(input).toBeInTheDocument();
  });
});
