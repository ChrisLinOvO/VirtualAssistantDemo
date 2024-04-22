import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import MicButton from "./MicButton";
import Transcript from "./Transcript";
import useSpeechToText from "../../hooks";
import { useStore } from "../../store";
import * as THREE from "three";

const SpeechToText = () => {
  const micRef = useRef<THREE.Group>(null!);
  const [, setOffsetY] = useState<number>(-0.2);
  const [transcriptRender, setTranscriptRender] = useState<
    {
      id: number;
      transcript: string;
      offsetY: number;
    }[]
  >([]);
  const [maxWidth, setMaxWidth] = useState<number>(1);
  const { sttInterimVal, isRecording } = useStore();

  const { error, startSpeechToText, stopSpeechToText, results } =
    useSpeechToText({
      continuous: true,
      crossBrowser: true,
      googleApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
      speechRecognitionProperties: { interimResults: true },
      useLegacyResults: false,
    });

  useEffect(() => {
    setTranscriptRender(
      results.map((result, index) => ({
        id: index,
        transcript: result.transcript,
        offsetY: -0.2 - 0.1 * index,
      }))
    );
    setOffsetY(-0.2 - 0.1 * results.length);
  }, [results]);

  useEffect(() => {
    if (micRef.current && micRef.current.geometry) {
      setMaxWidth(micRef.current.geometry.parameters.width);
    }
  }, [micRef]);

  const handleStartSpeech = useCallback(() => {
    startSpeechToText();
  }, [startSpeechToText]);

  const handleStopSpeech = useCallback(() => {
    stopSpeechToText();
  }, [stopSpeechToText]);

  const micButtonProps = useMemo(
    () => ({
      isRecording,
      startRecording: handleStartSpeech,
      stopRecording: handleStopSpeech,
    }),
    [isRecording, handleStartSpeech, handleStopSpeech]
  );

  return (
    <group ref={micRef} position={[-0.65, 0.2, 0]}>
      <MicButton {...micButtonProps} />
      <Transcript
        transcriptRender={transcriptRender}
        maxWidth={maxWidth}
        error={error}
        isRecording={isRecording}
        sttInterimVal={sttInterimVal}
      />
    </group>
  );
};

export default SpeechToText;
