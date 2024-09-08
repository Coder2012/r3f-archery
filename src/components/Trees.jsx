import { useMemo } from "react";
import { Instances, Instance, useGLTF } from "@react-three/drei";
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
export const InstancedTrees = ({ points }) => {
  const { nodes, materials } = useGLTF("/tree.glb");

  return (
    <Instances
      limit={points.length}
      geometry={nodes.Tree.geometry}
      material={materials.TreeMaterial}
    >
      {points.map((point, index) => (
        <Instance key={index} position={point} scale={[2, 2, 2]} />
      ))}
    </Instances>
  );
};

// Main Trees component to calculate tree positions based on texture
export const Trees = ({ maskTexture, terrainScale }) => {
  // Use useMemo to memoize points calculation and avoid unnecessary recalculations
  const points = useMemo(() => {
    if (!maskTexture) {
      return [];
    }

    const data = getImageData(maskTexture);
    const width = maskTexture.image.width;
    const height = maskTexture.image.height;

    // Define the terrain size you are matching to
    const terrainWidth = terrainScale[0];
    const terrainHeight = terrainScale[1];

    const sampler = new PoissonDiskSampling({
      shape: [width, height],
      minDistance: 40, // Increase to reduce number of points if needed
      tries: 30,
    });

    // Generate sampled points
    const sampledPoints = sampler.fill();
    return sampledPoints
      .map(([x, z]) => {
        const texX = Math.floor(x);
        const texY = Math.floor(z);
        const index = (texY * width + texX) * 4;
        const maskValue = data[index];

        // Scale the coordinates to match the terrain
        const scaledX = (x / width) * terrainWidth - terrainWidth / 2;
        const scaledZ = (z / height) * terrainHeight - terrainHeight / 2;

        if (maskValue > 200) {
          return [scaledX, 0, scaledZ];
        }
        return null;
      })
      .filter(Boolean); // Remove null entries
  }, [maskTexture, terrainScale]); // Dependencies ensure memoization

  return <InstancedTrees points={points} />;
};
