require('@testing-library/jest-dom');

import "@testing-library/jest-dom";

jest.mock("next/image", () => (props) => {
  const { priority, ...rest } = props;
  return <img {...rest} alt={props.alt || "mocked image"} />;
});

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

