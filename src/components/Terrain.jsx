import React from "react";
import { useGLTF } from "@react-three/drei";

export const Terrain = ({ terrainRef, ...props }) => {
  const { nodes, materials } = useGLTF("/terrain.glb");

  return (
    <group {...props} dispose={null}>
      <mesh
        ref={terrainRef} // Attaches the external ref to the mesh
        castShadow
        receiveShadow
        geometry={nodes.Terrain.geometry}
        material={materials.Mask}
      />
    </group>
  );
};

useGLTF.preload("/terrain.glb");
