import React from "react";
import { Perf } from "r3f-perf";
import { Canvas } from "@react-three/fiber";
import { Archery } from "./components/Archery";
import { Controls } from "./components/Controls";
import { Trees } from "./components/Trees";
import { Environment, OrbitControls } from "@react-three/drei";

const TextureDebug = ({ texture, terrainScale }) => {
  return (
    <mesh position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={terrainScale} />
      <meshBasicMaterial map={texture} transparent opacity={0.5} />
    </mesh>
  );
};

const App = () => {
  const terrainScale = React.useMemo(() => [100, 100, 3], []);
  // const pitch = -13 * (Math.PI / 180);
  const yaw = 0 * (Math.PI / 180);
  const [angle, setAngle] = React.useState(0);

  return (
    <>
      <Controls onChange={(angle) => setAngle(-angle * (Math.PI / 180))} />
      <Canvas shadows camera={{ fov: 50 }}>
        <OrbitControls />
        {/* <directionalLight
          castShadow
          position={[5, 15, -5]}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        /> */}
        <Environment preset="sunset" />
        <Trees terrainScale={terrainScale} />
        {/* <TextureDebug texture={maskTexture} terrainScale={[50, 50]} /> */}
        <Archery pitch={angle} yaw={yaw} />
        <Perf
          position="top-left"
          style={{
            transform: "scale(1.5) translate(0, 20px)",
            zIndex: 1000,
            top: "10px",
            left: "10px",
          }}
          matrixAutoUpdate
        />
      </Canvas>
    </>
  );
};

export default App;
