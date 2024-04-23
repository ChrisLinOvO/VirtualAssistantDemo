import { render, screen } from "@testing-library/react";

import App from "./App";

vi.mock("./app.js", () => ({
  default: () => <div>Hello World</div>,
}));

describe("App", () => {
  it("renders correctly", () => {
    render(<App />);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });
});
