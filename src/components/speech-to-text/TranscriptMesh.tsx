interface TranscriptMeshProps {
  position?: [number, number, number];
  scale?: [number, number, number];
  args?: [number, number];
  color?: string;
  opacity?: number;
}

const TranscriptMesh = ({
  args,
  color = "black",
  opacity = 1,
  ...rest
}: TranscriptMeshProps) => {
  return (
    <mesh {...rest}>
      <planeGeometry args={args} />
      <meshStandardMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
};

export default TranscriptMesh;
