import { render, screen, act, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Onboarding from "../page";

jest.mock("next/image", () => (props: any) => (
  <img {...props} alt={props.alt || "mocked image"} />
));

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    prefetch: jest.fn(),
  }),
}));

describe("Onboarding Component - Step 5: Continue button navigation", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    mockPush.mockClear();
  });

  test('clicking "Continue" should call router.push("/signin")', () => {
    render(<Onboarding />);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    const input = screen.getByPlaceholderText("Search schools");
    fireEvent.change(input, { target: { value: "Wayne State University" } });
    expect(input).toHaveValue("Wayne State University");

    const button = screen.getByRole("button", { name: /continue/i });
    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalledWith("/signin");
  });
});
