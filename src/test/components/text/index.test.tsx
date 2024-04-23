import { render, screen } from "@testing-library/react";
import TextUI from "../../../components/text";

const mockedTextProps = {
  color: "blue",
  anchorX: "left",
  anchorY: "top",
  textAlign: "left",
  position: [0, 1, 0],
};

vi.mock("@react-three/drei", () => ({
  Text: vi
    .fn()
    .mockImplementation(
      ({ children, anchorX, anchorY, textAlign, ...rest }) => (
        <div
          {...rest}
          data-testid="mocked-text"
          anchorx={anchorX}
          anchory={anchorY}
          textalign={textAlign}
        >
          {children}
        </div>
      )
    ),
}));

describe("TextUI component", () => {
  it("renders TextUI component with custom props", () => {
    render(
      <TextUI
        color="blue"
        anchorX="left"
        anchorY="top"
        textAlign="left"
        position={[0, 1, 0]}
      >
        Custom Text
      </TextUI>
    );

    const renderedText = screen.getByTestId("mocked-text");
    expect(renderedText).toBeInTheDocument();
    expect(renderedText).toHaveTextContent("Custom Text");

    Object.entries(mockedTextProps).forEach(([prop, value]) => {
      expect(renderedText).toHaveAttribute(prop, String(value));
    });
  });
});
