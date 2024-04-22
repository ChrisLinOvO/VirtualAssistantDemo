import TextUI from "../text";
import TranscriptMesh from "./TranscriptMesh";

interface MicButtonProps {
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
}

const MicButton = ({
  isRecording,
  startRecording,
  stopRecording,
  ...rest
}: MicButtonProps) => {
  return (
    <mesh {...rest} onClick={isRecording ? stopRecording : startRecording}>
      <TranscriptMesh args={[0.45, 0.1]} color={isRecording ? "red" : "blue"} />
      <TextUI position={[0.05, 0, 0.05]} fontSize={0.05}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </TextUI>
    </mesh>
  );
};

export default MicButton;
