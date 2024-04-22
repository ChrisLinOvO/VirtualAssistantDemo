import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import World from "./world";

const App = () => {
  return (
    <Canvas camera={{ position: [0, 0.05, 0.7] }}>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI}
      />
      <pointLight position={[-30, -10, -10]} decay={1} intensity={Math.PI} />
      <OrbitControls minDistance={0.4} maxDistance={2} />
      <World />
    </Canvas>
  );
};

export default App;
