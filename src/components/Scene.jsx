import { Environment, OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { Trees } from "./Trees";
import { Archery } from "./Archery";

export const Scene = ({ orbitControlsRef, pitch, yaw }) => {
  const { camera } = useThree();

  const terrainScale = useMemo(() => [100, 100, 3], []);

  useEffect(() => {
    const controls = orbitControlsRef.current;
    if (!controls) return;

    const handleControlsEnd = () => {
      console.log("Camera Position:", camera.position);
      console.log("Camera Target:", controls.target);
    };

    controls.addEventListener("end", handleControlsEnd);

    return () => {
      controls.removeEventListener("end", handleControlsEnd);
    };
  }, [orbitControlsRef, camera]);

  return (
    <>
      <OrbitControls ref={orbitControlsRef} />
      <Environment preset="sunset" />
      <directionalLight
        position={[10, 20, 10]}
        intensity={2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.1}
        shadow-camera-far={500}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
      />
      <Trees terrainScale={terrainScale} />
      <Archery pitch={pitch} yaw={yaw} orbitControlsRef={orbitControlsRef} />
    </>
  );
};
