import { Fragment } from "react";
import TextUI from "../text";
import TranscriptMesh from "./TranscriptMesh";

interface TranscriptProps {
  transcriptRender: { id: string; transcript: string; offsetY: number }[];
  maxWidth: number;
  error: string | null;
  isRecording: boolean;
  sttInterimVal: string | null;
}

const Transcript = ({
  transcriptRender,
  maxWidth,
  error,
  isRecording,
  sttInterimVal,
  ...rest
}: TranscriptProps) => {
  return (
    <group {...rest}>
      <TranscriptMesh
        position={[0, -0.1, 0]}
        scale={[2, 0.1, 1]}
        args={[0.3, 0.5]}
        opacity={0.5}
      ></TranscriptMesh>
      <TextUI
        position={[-0.2, -0.1, 0.01]}
        fontSize={0.03}
        textAlign="left"
        anchorX="left"
      >
        {error
          ? error
          : `Current Value: ${
              isRecording && sttInterimVal ? sttInterimVal : ""
            }`}
      </TextUI>
      {isRecording &&
        transcriptRender.length > 0 &&
        transcriptRender.map(({ id, transcript, offsetY }) => (
          <Fragment key={id}>
            <TranscriptMesh
              position={[0, offsetY, 0]}
              scale={[maxWidth, 0.1, 1]}
              args={[0.6, 0.5]}
              opacity={0.5}
            ></TranscriptMesh>
            <TextUI
              position={[-0.2, offsetY, 0.01]}
              fontSize={0.03}
              textAlign="left"
              anchorX="left"
            >
              {transcript && transcript}
            </TextUI>
          </Fragment>
        ))}
    </group>
  );
};

export default Transcript;
