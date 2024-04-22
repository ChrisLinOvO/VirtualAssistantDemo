import { useState, useEffect, useRef } from "react";
import Hark from "hark";
import { startRecording, stopRecording } from "./recorderHelpers";
import { useStore, dispatch } from "../store";

interface SpeechToTextOptions {
  continuous: boolean;
  crossBrowser: boolean;
  googleApiKey: string;
  onStartSpeaking?: () => void;
  onStoppedSpeaking?: () => void;
  speechRecognitionProperties?: {
    interimResults: boolean;
    grammars?: SpeechGrammarList;
    lang?: string;
    maxAlternatives?: number;
  };
  timeout?: number;
  useOnlyGoogleCloud?: boolean;
  useLegacyResults?: boolean;
}

interface SpeechResult {
  transcript: string;
  timestamp: number;
}

interface SpeechToTextHook {
  error: string;
  results: SpeechResult[] | string[];
  startSpeechToText: () => void;
  stopSpeechToText: () => void;
}

const AudioContext = window.AudioContext || window.webkitAudioContext;
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

const useSpeechToText = ({
  continuous,
  crossBrowser,
  googleApiKey,
  onStartSpeaking,
  onStoppedSpeaking,
  speechRecognitionProperties = { interimResults: true },
  timeout = 10000,
  useOnlyGoogleCloud = false,
  useLegacyResults = true,
}: SpeechToTextOptions): SpeechToTextHook => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [legacyResults, setLegacyResults] = useState<string[]>([]);
  const [results, setResults] = useState<SpeechResult[]>([]);
  const [error, setError] = useState<string>("");
  const timeoutId = useRef<number | null>(null);
  const mediaStream = useRef<MediaStream | null>(null);
  // Flag to check for first click
  const isFirstClick = useRef<boolean>(true);
  const { isRecording } = useStore();

  useEffect(() => {
    if (!crossBrowser && !recognition) {
      setError("Speech Recognition API is only available on Chrome");
    }

    if (!navigator?.mediaDevices?.getUserMedia) {
      setError("getUserMedia is not supported on this device/browser :(");
    }

    if ((crossBrowser || useOnlyGoogleCloud) && !googleApiKey) {
      console.error(
        "No google cloud API key was passed, google API will not be able to process speech"
      );
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    if (useLegacyResults) {
      console.warn(
        "react-hook-speech-to-text is using legacy results, pass useLegacyResults: false to the hook to use the new array of objects results. Legacy array of strings results will be removed in a future version."
      );
    }
  }, [crossBrowser, googleApiKey, useLegacyResults, useOnlyGoogleCloud]);

  // Chrome Speech Recognition API:
  // Only supported on Chrome browsers
  const chromeSpeechRecognition = () => {
    if (recognition) {
      // Continuous recording after stopped speaking event
      if (continuous) recognition.continuous = true;

      const { grammars, interimResults, lang, maxAlternatives } =
        speechRecognitionProperties || {};

      if (grammars) recognition.grammars = grammars;
      if (lang) recognition.lang = lang;

      recognition.interimResults = interimResults || false;
      recognition.maxAlternatives = maxAlternatives || 1;

      // start recognition
      if (!isRecording) {
        // Check recording state before starting
        recognition.start();
        dispatch({ type: "SET_IS_RECORDING", payload: true });
      }

      // speech successfully translated into text
      recognition.onresult = (e) => {
        const result = e.results[e.results.length - 1];
        const { transcript } = result[0];
        const timestamp = Math.floor(Date.now() / 1000);

        // Allows for realtime speech result UI feedback
        if (interimResults) {
          if (result.isFinal) {
            setResults((prevResults) => [
              ...prevResults,
              { transcript, timestamp },
            ]);
            setLegacyResults((prevResults) => [...prevResults, transcript]);
          } else {
            let concatTranscripts = "";
            // If continuous: e.results will include previous speech results: need to start loop at the current event resultIndex for proper concatenation
            for (let i = e.resultIndex; i < e.results.length; i++) {
              concatTranscripts += e.results[i][0].transcript;
            }
            dispatch({ type: "SET_INTERIM_VAL", payload: concatTranscripts });
          }
        } else {
          setResults((prevResults) => [
            ...prevResults,
            { transcript, timestamp },
          ]);
          setLegacyResults((prevResults) => [...prevResults, transcript]);
        }
      };
      recognition.onaudiostart = () =>
        dispatch({ type: "SET_IS_RECORDING", payload: true });
      // Audio stopped recording or timed out.
      // Chrome speech auto times-out if no speech after a while
      recognition.onend = () =>
        dispatch({ type: "SET_IS_RECORDING", payload: false });
    } else {
      console.error("Your browser does not support speech recognition");
    }
  };

  const startSpeechToText = async () => {
    if (!useOnlyGoogleCloud && recognition) {
      // Check if it's the first click
      if (isFirstClick.current) {
        chromeSpeechRecognition();
        isFirstClick.current = false;
      }
      return;
    }

    if (!crossBrowser && !useOnlyGoogleCloud) {
      return;
    }

    if (audioContextRef.current?.state === "suspended") {
      audioContextRef.current?.resume();
    }

    const stream = await startRecording({
      errHandler: () => setError("Microphone permission was denied"),
      audioContext: audioContextRef.current,
    });

    dispatch({ type: "SET_IS_RECORDING", payload: true });

    if (timeout) {
      clearTimeout(timeoutId.current);
      handleRecordingTimeout();
    }

    if (mediaStream.current) {
      stopMediaStream();
    }

    mediaStream.current = stream.clone();

    const speechEvents = Hark(mediaStream.current, {
      audioContext: audioContextRef.current,
    });

    speechEvents.on("speaking", () => {
      if (onStartSpeaking) onStartSpeaking();
      clearTimeout(timeoutId.current);
    });

    speechEvents.on("stopped_speaking", () => {
      if (onStoppedSpeaking) onStoppedSpeaking();
      stopRecording({
        exportWAV: true,
        wavCallback: (blob) =>
          handleBlobToBase64({ blob, continuous: continuous || false }),
      });
    });
  };

  const stopSpeechToText = () => {
    if (recognition && !useOnlyGoogleCloud) {
      // Stop recognition if using browser API
      recognition.abort();
    } else {
      dispatch({ type: "SET_IS_RECORDING", payload: false });
      stopMediaStream();
      stopRecording({
        exportWAV: true,
        wavCallback: (blob) => handleBlobToBase64({ blob, continuous: false }),
      });
    }
    isFirstClick.current = true;
  };

  const handleRecordingTimeout = () => {
    timeoutId.current = window.setTimeout(() => {
      dispatch({ type: "SET_IS_RECORDING", payload: false });
      stopMediaStream();
      stopRecording({ exportWAV: false });
    }, timeout);
  };

  const handleBlobToBase64 = ({
    blob,
    continuous,
  }: {
    blob: Blob;
    continuous: boolean;
  }) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);

    reader.onloadend = async () => {
      const base64data = reader.result;
      let sampleRate = audioContextRef.current?.sampleRate;
      if (sampleRate && sampleRate > 48000) {
        sampleRate = 48000;
      }
      const audio = { content: "" };
      const config = {
        encoding: "LINEAR16",
        languageCode: "en-US",
        sampleRateHertz: sampleRate,
      };
      const data = { config, audio };
      audio.content = base64data!
        .toString()
        .substr(base64data!.toString().indexOf(",") + 1);
      const googleCloudRes = await fetch(
        `https://speech.googleapis.com/v1/speech:recognize?key=${googleApiKey}`,
        { method: "POST", body: JSON.stringify(data) }
      );
      const googleCloudJson = await googleCloudRes.json();
      if (googleCloudJson.results?.length > 0) {
        const { transcript } = googleCloudJson.results[0].alternatives[0];
        setLegacyResults((prevResults) => [...prevResults, transcript]);
        setResults((prevResults) => [
          ...prevResults,
          {
            speechBlob: blob,
            transcript,
            timestamp: Math.floor(Date.now() / 1000),
          },
        ]);
      }
      if (continuous) {
        startSpeechToText();
      } else {
        stopMediaStream();
        dispatch({ type: "SET_IS_RECORDING", payload: false });
      }
    };
  };

  const stopMediaStream = () => {
    mediaStream.current?.getAudioTracks()[0].stop();
  };

  return {
    error,
    results: useLegacyResults ? legacyResults : results,
    startSpeechToText,
    stopSpeechToText,
  };
};

export default useSpeechToText;
