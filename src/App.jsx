import React, { useRef, useState } from "react";
import { Perf } from "r3f-perf";
import { Canvas } from "@react-three/fiber";
import { Controls } from "./components/Controls";
import { Vector3 } from "three";
import { CameraPresets } from "./components/CameraPresets";
import { Scene } from "./components/Scene";

const App = () => {
  const orbitControlsRef = useRef();

  const yaw = 0 * (Math.PI / 180);
  const [pitch, setPitch] = useState(0);

  const cameraPresets = {
    Bow: {
      position: new Vector3(.10, .60, -.7),
      target: new Vector3(.10, .54, 0.05),
    },
    Side: {
      position: new Vector3(-21, 8, 14),
      target: new Vector3(0, 3, 14),
    },
    Above: {
      position: new Vector3(0, 8, 0),
      target: new Vector3(-0.17, 1.03, 26.24),
    },
  };

  const handleSelectPreset = (presetName) => {
    const controls = orbitControlsRef.current;
    const preset = cameraPresets[presetName];

    if (controls && preset) {
      controls.object.position.copy(preset.position);
      controls.target.copy(preset.target);
      controls.update();
    }
  };

  return (
    <>
      <CameraPresets
        presets={cameraPresets}
        onSelectPreset={handleSelectPreset}
      />
      <Controls onChange={(pitch) => setPitch(-pitch * (Math.PI / 180))} />
      <Canvas shadows camera={{ fov: 50 }}>
        <fog attach="fog" args={["#fff", 5, 70]} />
        <Scene orbitControlsRef={orbitControlsRef} pitch={pitch} yaw={yaw} />
        <Perf
          position="top-left"
          style={{
            transform: "scale(1.5) translate(0, 0)",
            zIndex: 1,
            top: "50px",
            left: "100px",
          }}
          matrixAutoUpdate
        />
      </Canvas>
    </>
  );
};

export default App;
