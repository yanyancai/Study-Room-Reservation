import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import Onboarding from "../page";

jest.mock("next/image", () => (props: any) => {
  const { priority, ...rest } = props;
  return <img {...rest} alt={props.alt || "mocked image"} />;
});

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

describe("Onboarding Component - Step 4: datalist contains school options", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test("renders predefined school options inside datalist", () => {
    render(<Onboarding />);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    const datalist = screen.getByTestId("school-list");
    expect(datalist).toBeInTheDocument();

    const options = datalist.querySelectorAll("option");
    const values = Array.from(options).map((opt) => opt.getAttribute("value"));

    expect(values).toEqual(
      expect.arrayContaining([
        "Wayne State University",
      ])
    );
  });
});
