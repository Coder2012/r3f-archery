import React, { useRef } from "react";
import { Perf } from "r3f-perf";
import { TextureLoader } from "three";
import { Canvas, useLoader } from "@react-three/fiber";
import { Archery } from "./components/Archery";
import { Controls } from "./components/Controls";
import { Trees } from "./components/Trees";
import { OrbitControls } from "@react-three/drei";
import { Terrain } from "./components/Terrain";

const TextureDebug = ({ texture, terrainScale }) => {
  return (
    <mesh position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={terrainScale} />
      <meshBasicMaterial map={texture} transparent opacity={0.5} />
    </mesh>
  );
};

const App = () => {
  const maskTexture = useLoader(TextureLoader, "MaskTexture.png");
  const terrainRef = useRef();

  // const pitch = -13 * (Math.PI / 180);
  const yaw = 0 * (Math.PI / 180);
  const [angle, setAngle] = React.useState(0);

  return (
    <>
      <Controls onChange={(angle) => setAngle(-angle * (Math.PI / 180))} />
      <Canvas shadows camera={{ fov: 50 }}>
        <OrbitControls />
        <Terrain terrainRef={terrainRef} />
        <Trees
          maskTexture={maskTexture}
          terrainRef={terrainRef}
          terrainScale={[50, 50]}
        />
        <TextureDebug texture={maskTexture} terrainScale={[50, 50]} />
        <Archery pitch={angle} yaw={yaw} />
        <Perf
          position="top-left"
          style={{
            transform: "scale(1.5) translate(0, 20px)", // Scale up and adjust downwards
            zIndex: 1000,
            top: "10px", // Adjust top position if necessary
            left: "10px", // Adjust left position if needed
          }}
          matrixAutoUpdate
        />
      </Canvas>
    </>
  );
};

export default App;
