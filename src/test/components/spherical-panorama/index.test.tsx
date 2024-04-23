import { render, screen } from "@testing-library/react";
import SphericalPanorama from "../../../components/spherical-panorama";

vi.mock("@react-three/drei", () => ({
  useTexture: vi.fn().mockImplementation((imgSrc, callback) => {
    const texture = {
      wrapS: 1001,
      repeat: { x: -1 },
    };
    if (callback) {
      callback(texture);
    }
    return texture;
  }),
  Sphere: vi
    .fn()
    .mockImplementation(({ radius = 1, ...rest }) => (
      <div data-testid="sphere-mock" args={[radius]} {...rest} />
    )),
}));

describe("SphericalPanorama component", () => {
  it("renders SphericalPanorama component with custom props", () => {
    render(<SphericalPanorama imgSrc="123.jpg" radius={1.6} />);
    const renderedSphere = screen.getByTestId("sphere-mock");
    expect(renderedSphere).toBeInTheDocument();
    expect(renderedSphere).toHaveAttribute("args", "1.6");
  });
});
