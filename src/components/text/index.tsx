import { Text } from "@react-three/drei";

interface TextUIProps {
  children: React.ReactNode;
  color?: string;
  position?: [number, number, number];
  fontSize?: number;
  anchorX?: number | "center" | "left" | "right" | undefined;
  anchorY?:
    | number
    | "middle"
    | "top"
    | "top-baseline"
    | "bottom-baseline"
    | "bottom"
    | undefined;
  textAlign?: "center" | "left" | "right" | "justify" | undefined;
}

export default function TextUI({
  children,
  color = "white",
  anchorX = "center",
  anchorY = "middle",
  textAlign = "center",
  ...rest
}: TextUIProps) {
  return (
    <Text
      {...rest}
      color={color}
      anchorX={anchorX}
      anchorY={anchorY}
      textAlign={textAlign}
    >
      {children}
    </Text>
  );
}
