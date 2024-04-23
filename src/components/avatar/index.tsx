import { useEffect, useRef, useMemo } from "react";
import { useGLTF, useFBX, useAnimations } from "@react-three/drei";
import { useControls } from "leva";
import { useStore } from "../../store";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { GLTF } from "three-stdlib";

interface AvatarProps {
  position: [number, number, number];
}

interface MouthCue {
  start: number;
  end: number;
  value: string;
}

interface AnimationData {
  key: string;
  path: string;
}

interface AudioProps {
  play: () => void;
  pause: () => void;
  currentTime: number;
  src: string;
}

const corresponding: { [key: string]: string } = {
  A: "viseme_PP",
  B: "viseme_kk",
  C: "viseme_I",
  D: "viseme_AA",
  E: "viseme_O",
  F: "viseme_U",
  G: "viseme_FF",
  H: "viseme_TH",
  X: "viseme_PP",
};

const useSkinnedControls = (
  name: string,
  defaultValue: boolean,
  options: { min: number; max: number; step: number }
) => {
  return useControls({
    [name]: {
      value: defaultValue,
      ...options,
      label: name,
    },
  });
};

type GLTFResult = GLTF & {
  nodes: {
    EyeLeft: THREE.SkinnedMesh;
    EyeRight: THREE.SkinnedMesh;
    Wolf3D_Head: THREE.SkinnedMesh & {
      morphTargetInfluences: number[];
      morphTargetDictionary: { [key: string]: number };
    };
    Wolf3D_Teeth: THREE.SkinnedMesh & {
      morphTargetInfluences: number[];
      morphTargetDictionary: { [key: string]: number };
    };
    Wolf3D_Hair: THREE.SkinnedMesh;
    Wolf3D_Body: THREE.SkinnedMesh;
    Wolf3D_Glasses: THREE.SkinnedMesh;
    Wolf3D_Outfit_Bottom: THREE.SkinnedMesh;
    Wolf3D_Outfit_Footwear: THREE.SkinnedMesh;
    Wolf3D_Outfit_Top: THREE.SkinnedMesh;
    Hips: THREE.Bone;
  };
  materials: {
    Wolf3D_Eye: THREE.MeshStandardMaterial;
    Wolf3D_Skin: THREE.MeshStandardMaterial;
    Wolf3D_Teeth: THREE.MeshStandardMaterial;
    Wolf3D_Hair: THREE.MeshStandardMaterial;
    Wolf3D_Body: THREE.MeshStandardMaterial;
    Wolf3D_Glasses: THREE.MeshStandardMaterial;
    Wolf3D_Outfit_Bottom: THREE.MeshStandardMaterial;
    Wolf3D_Outfit_Footwear: THREE.MeshStandardMaterial;
    Wolf3D_Outfit_Top: THREE.MeshStandardMaterial;
  };
};

export default function Avatar({ ...props }: AvatarProps) {
  const rootRef = useRef<THREE.Group>(null!);
  const { nodes, materials } = useGLTF(
    "models/660a42e371dbbf09c6d79e6a.glb"
  ) as GLTFResult;

  const animationsData: AnimationData[] = [
    { key: "Boxing", path: "animations/Boxing.fbx" },
    { key: "Angry", path: "animations/Standing Arguing.fbx" },
    { key: "Dance", path: "animations/Tut Hip Hop Dance.fbx" },
    { key: "Idle", path: "animations/Standing Idle.fbx" },
  ];

  const animationObjects: { [key: string]: THREE.AnimationClip } = {};
  animationsData.forEach(({ key, path }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { animations } = useFBX(path);
    animations[0].name = key;
    animationObjects[key] = animations[0];
  });

  const { sttInterimVal, isRecording } = useStore();

  const { actions } = useAnimations(Object.values(animationObjects), rootRef);

  const Wolf3D_Hair_Params = useSkinnedControls("Wolf3D_Hair", true, {
    min: 0,
    max: 15,
    step: 0.1,
  });
  const Wolf3D_Glasses_Params = useSkinnedControls("Wolf3D_Glasses", true, {
    min: 0,
    max: 1,
    step: 0.1,
  });

  const { plauAudio, script } = useControls({
    plauAudio: false,
    script: {
      value: "dance",
      options: ["dance", "angry", "boxing"],
    },
  });

  const audio = useMemo<AudioProps>(
    () => new Audio(`audios/${script}.mp3`),
    [script]
  );
  const jsonFile = useLoader(
    THREE.FileLoader,
    `audios/${script}.json`
  ) as string;
  const lipsync: { mouthCues: MouthCue[] } = JSON.parse(jsonFile);

  useFrame(() => {
    const currentAudioTime = audio.currentTime;

    Object.values(corresponding).forEach((value) => {
      nodes.Wolf3D_Head.morphTargetInfluences[
        nodes.Wolf3D_Head.morphTargetDictionary[value]
      ] = 0;
      nodes.Wolf3D_Teeth.morphTargetInfluences[
        nodes.Wolf3D_Teeth.morphTargetDictionary[value]
      ] = 0;
    });

    for (let i = 0; i < lipsync.mouthCues.length; i++) {
      const mouthCue = lipsync.mouthCues[i];
      if (
        currentAudioTime >= mouthCue.start &&
        currentAudioTime <= mouthCue.end
      ) {
        nodes.Wolf3D_Head.morphTargetInfluences[
          nodes.Wolf3D_Head.morphTargetDictionary[corresponding[mouthCue.value]]
        ] = 1;
        nodes.Wolf3D_Teeth.morphTargetInfluences[
          nodes.Wolf3D_Teeth.morphTargetDictionary[
            corresponding[mouthCue.value]
          ]
        ] = 1;
        break;
      }
    }
  });

  useEffect(() => {
    // If not recording, stop animations and audio
    if (!isRecording) {
      actions["Idle"]?.play();
      audio.pause();
      // Exit early
      return;
    }
    audio.pause();
    const keywords = ["打拳擊", "生氣", "跳舞"];
    let matchedKeyword = null;

    for (const keyword of keywords) {
      if (sttInterimVal.includes(keyword)) {
        matchedKeyword = keyword;
        break;
      }
    }

    switch (matchedKeyword) {
      case "打拳擊": {
        actions["Boxing"]?.play();
        audio.src = "audios/boxing.mp3";
        audio.play();
        break;
      }
      case "生氣": {
        actions["Angry"]?.play();
        audio.src = "audios/angry.mp3";
        audio.play();
        break;
      }
      case "跳舞": {
        actions["Dance"]?.play();
        audio.src = "audios/dance.mp3";
        audio.play();
        break;
      }
      default:
        actions["Idle"]?.play();
    }
  }, [actions, sttInterimVal, isRecording, audio]);

  useEffect(() => {
    if (plauAudio) {
      switch (script) {
        case "boxing": {
          actions["Boxing"]?.play();
          audio.play();
          break;
        }
        case "angry": {
          actions["Angry"]?.play();
          audio.play();
          break;
        }
        case "dance": {
          actions["Dance"]?.play();
          audio.play();
          break;
        }
        default:
          actions["Idle"]?.play();
      }
    } else {
      audio.pause();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plauAudio, script]);

  return (
    <group ref={rootRef} {...props} dispose={null}>
      <primitive object={nodes.Hips} />
      {Wolf3D_Hair_Params.Wolf3D_Hair && (
        <skinnedMesh
          name="Wolf3D_Hair"
          geometry={nodes.Wolf3D_Hair.geometry}
          material={materials.Wolf3D_Hair}
          skeleton={nodes.Wolf3D_Hair.skeleton}
        />
      )}
      {Wolf3D_Glasses_Params.Wolf3D_Glasses && (
        <skinnedMesh
          name="Wolf3D_Glasses"
          geometry={nodes.Wolf3D_Glasses.geometry}
          material={materials.Wolf3D_Glasses}
          skeleton={nodes.Wolf3D_Glasses.skeleton}
        />
      )}
      <skinnedMesh
        name="Wolf3D_Body"
        geometry={nodes.Wolf3D_Body.geometry}
        material={materials.Wolf3D_Body}
        skeleton={nodes.Wolf3D_Body.skeleton}
      />
      <skinnedMesh
        name="Wolf3D_Outfit_Bottom"
        geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
        material={materials.Wolf3D_Outfit_Bottom}
        skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
      />
      <skinnedMesh
        name="Wolf3D_Outfit_Footwear"
        geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
        material={materials.Wolf3D_Outfit_Footwear}
        skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
      />
      <skinnedMesh
        name="Wolf3D_Outfit_Top"
        geometry={nodes.Wolf3D_Outfit_Top.geometry}
        material={materials.Wolf3D_Outfit_Top}
        skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
      />
      <skinnedMesh
        name="EyeLeft"
        geometry={nodes.EyeLeft.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeLeft.skeleton}
        morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
      />
      <skinnedMesh
        name="EyeRight"
        geometry={nodes.EyeRight.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeRight.skeleton}
        morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Head"
        geometry={nodes.Wolf3D_Head.geometry}
        material={materials.Wolf3D_Skin}
        skeleton={nodes.Wolf3D_Head.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
      />

      <skinnedMesh
        name="Wolf3D_Teeth"
        geometry={nodes.Wolf3D_Teeth.geometry}
        material={materials.Wolf3D_Teeth}
        skeleton={nodes.Wolf3D_Teeth.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
      />
    </group>
  );
}

// have smile element
useGLTF.preload("models/660a42e371dbbf09c6d79e6a.glb");
