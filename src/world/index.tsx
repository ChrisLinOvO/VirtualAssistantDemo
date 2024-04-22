import { Suspense } from "react";
import Avatar from "../components/avatar";
import SphericalPanorama from "../components/spherical-panorama";
import SpeechToText from "../components/speech-to-text";
import backgroundImg from "../assets/images/amazon_forest.jpg";

export default function World() {
  return (
    <Suspense fallback={null}>
      <Avatar position={[0, -1.6, 0]} />
      <SphericalPanorama imgSrc={backgroundImg} radius={1.6} />
      <SpeechToText />
    </Suspense>
  );
}
