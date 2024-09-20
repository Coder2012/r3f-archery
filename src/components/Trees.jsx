import { useMemo, useRef } from "react";
import {
  Instances,
  Instance,
  useTexture,
  useGLTF,
  Plane,
} from "@react-three/drei";
import * as THREE from "three";
import PoissonDiskSampling from "poisson-disk-sampling";

// Function to extract pixel data from the texture
const getImageData = (texture) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const { width, height } = texture.image;

  // Set canvas size to match texture size
  canvas.width = width;
  canvas.height = height;

  // Draw the image onto the canvas
  ctx.drawImage(texture.image, 0, 0, width, height);

  // Extract pixel data
  return ctx.getImageData(0, 0, width, height).data;
};

// Component for rendering instanced trees
export const InstancedTrees = ({ positions, scales }) => {
  const { nodes, materials } = useGLTF("/tree.glb");

  return (
    <Instances
      limit={positions.length}
      geometry={nodes.Tree.geometry}
      material={materials.TreeMaterial}
    >
      {positions.map((position, index) => (
        <Instance key={index} position={position} scale={scales[index]} />
      ))}
    </Instances>
  );
};

// Main Trees component
export const Trees = ({ map, normalMap, displacementMap, terrainScale }) => {
  const terrainRef = useRef();
  const terrainTextures = useTexture({
    map: "snow_02_diff_2k.png",
    normalMap: "snow_02_nor_gl_2k.png",
    displacementMap: "MaskTexture.png",
  });
  console.log(terrainTextures);

  // Generate positions and scales
  const { positions, scales } = useMemo(() => {
    if (
      !terrainTextures.displacementMap ||
      !terrainTextures.displacementMap.image
    ) {
      return { positions: [], scales: [] };
    }

    const displacementData = getImageData(terrainTextures.displacementMap);

    const width = terrainTextures.displacementMap.image.width;
    const height = terrainTextures.displacementMap.image.height;

    const terrainWidth = terrainScale[0];
    const terrainHeight = terrainScale[1];
    const displacementScale = terrainScale[2];

    // Generate sampled points in world coordinates
    const sampler = new PoissonDiskSampling({
      shape: [terrainWidth, terrainHeight],
      minDistance: 1,
      tries: 30,
    });

    const sampledPoints = sampler.fill();

    const positions = [];
    const scales = [];

    sampledPoints.forEach(([x, z]) => {
      // Adjust x and z to be centered around (0, 0)
      const scaledX = x - terrainWidth / 2;
      const scaledZ = z - terrainHeight / 2;

      // Map world coordinates to UV coordinates
      const u = (scaledX + terrainWidth / 2) / terrainWidth;
      const v = (scaledZ + terrainHeight / 2) / terrainHeight;

      // Map UV coordinates to texture pixel coordinates
      const texX = Math.floor(u * (width - 1));
      const texY = Math.floor(v * (height - 1));

      const index = (texY * width + texX) * 4;

      const displacementValue = displacementData[index];

      if (displacementValue > 240) {
        // Normalize the displacement value
        const normalizedDisplacement = displacementValue / 255;

        // Calculate the actual y-coordinate
        const scaledY = normalizedDisplacement * displacementScale; // Adjust as needed

        // Calculate tree scale
        const treeScaleFactor =
          (displacementValue / 255) * (Math.random() * 1) + 2; // Adjust as needed
        const treeScale = [treeScaleFactor, treeScaleFactor, treeScaleFactor];

        positions.push([scaledX, scaledY, scaledZ]);
        scales.push(treeScale);
      }
    });

    return { positions, scales };
  }, [terrainTextures.displacementMap, terrainScale]);

  return (
    <>
      <Plane
        ref={terrainRef}
        args={[terrainScale[0], terrainScale[1], 128, 128]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial
          {...terrainTextures}
          displacementScale={terrainScale[2]}
          side={THREE.DoubleSide}
        />
      </Plane>

      <InstancedTrees positions={positions} scales={scales} />
    </>
  );
};
