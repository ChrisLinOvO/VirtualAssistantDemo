import * as THREE from "three";
import { type ComponentProps } from "react";
import { useTexture, Sphere } from "@react-three/drei";

interface SphericalPanoramaProps extends ComponentProps<typeof Sphere> {
  imgSrc: string;
  radius?: number;
}

const SphericalPanorama = ({
  imgSrc,
  radius = 1,
  ...rest
}: SphericalPanoramaProps) => {
  const map = useTexture(imgSrc, (texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.x = -1;
  });

  return (
    <Sphere args={[radius]} {...rest}>
      <meshBasicMaterial map={map} side={THREE.BackSide} />
    </Sphere>
  );
};

export default SphericalPanorama;
