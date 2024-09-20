import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import { Vector3, Quaternion, Box3 } from "three";
import gsap from "gsap";
import { Target } from "./Target";
import { Archer } from "./Archer";

export const Archery = ({ pitch, yaw, orbitControlsRef }) => {
  const { scene, camera } = useThree();
  const targetRef = useRef();

  const archerRefs = {
    containerRef: useRef(),
    bowRef: useRef(),
    arrow1Ref: useRef(),
  };

  const velocityRef = useRef(new Vector3());
  const gravityRef = useRef(new Vector3(0, -9.81, 0));
  const arrowFiredRef = useRef(false);
  const arrowHitRef = useRef(false);

  const handleKeyDown = (event) => {
    switch (event.key) {
      case " ":
        const initialSpeed = 27;

        const arrowQuaternion = new Quaternion();
        archerRefs.arrow1Ref.current.getWorldQuaternion(arrowQuaternion);

        velocityRef.current
          .set(0, 0, 1)
          .applyQuaternion(arrowQuaternion)
          .multiplyScalar(initialSpeed);
        arrowFiredRef.current = true;
        break;

      case "1":
        moveToPosition(
          [
            archerRefs.bowRef.current.position.x - 3,
            archerRefs.bowRef.current.position.y + 2,
            archerRefs.bowRef.current.position.z,
          ],
          new Vector3(0, 0, 0)
        );
        break;

      case "r":
        reset();
        resetCamera();
        break;
      case "s":
        reset();
        break;
    }
  };

  const reset = () => {
    arrowFiredRef.current = false;
    arrowHitRef.current = false;
    velocityRef.current.set(0, 0, 0);
    archerRefs.arrow1Ref.current.position.copy(
      archerRefs.bowRef.current.position
    );
    archerRefs.arrow1Ref.current.rotation.copy(
      archerRefs.bowRef.current.rotation
    );
  };

  const resetCamera = () => {
    camera.position.set(-1, 1, -3);
    camera.lookAt(targetRef.current.position);
  };

  const moveToPosition = (position, targetVector, duration = 1.5) => {
    orbitControlsRef.current.enabled = false;
    const initialQuaternion = camera.quaternion.clone();

    gsap.to(camera.position, {
      x: position[0],
      y: position[1],
      z: position[2],
      duration: duration,
      ease: "power1.inOut",
      onUpdate: function () {
        camera.lookAt(targetVector);
        const targetQuaternion = camera.quaternion.clone();

        camera.quaternion.slerpQuaternions(
          initialQuaternion,
          targetQuaternion,
          this.progress()
        );
      },
      onComplete: () => {
        camera.lookAt(targetVector);
        orbitControlsRef.current.target.copy(targetVector);
        orbitControlsRef.current.update();
        orbitControlsRef.current.enabled = true;
      },
    });
  };

  useEffect(() => {
    console.log("mounted");

    targetRef.current.position.set(0, 1, 30);
    resetCamera();

    if (archerRefs.bowRef.current && archerRefs.arrow1Ref.current) {
      archerRefs.arrow1Ref.current.position.copy(
        archerRefs.bowRef.current.position
      );
      archerRefs.arrow1Ref.current.rotation.copy(
        archerRefs.bowRef.current.rotation
      );
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      console.log("unmounted");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [scene, camera]);

  useFrame((state, delta) => {
    const scaledDelta = delta * 0.8;

    if (
      archerRefs.bowRef.current &&
      archerRefs.arrow1Ref.current &&
      !arrowFiredRef.current
    ) {
      archerRefs.bowRef.current.rotation.set(pitch, yaw, 0);
      archerRefs.arrow1Ref.current.rotation.copy(
        archerRefs.bowRef.current.rotation
      );
    }

    if (
      archerRefs.arrow1Ref.current &&
      !arrowHitRef.current &&
      arrowFiredRef.current
    ) {
      velocityRef.current.addScaledVector(gravityRef.current, scaledDelta);

      archerRefs.arrow1Ref.current.position.addScaledVector(
        velocityRef.current,
        scaledDelta
      );

      const direction = velocityRef.current.clone().normalize();

      const quaternion = new Quaternion();
      quaternion.setFromUnitVectors(new Vector3(0, 0, 1), direction);
      archerRefs.arrow1Ref.current.quaternion.copy(quaternion);

      const arrowTipPosition = archerRefs.arrow1Ref.current.position
        .clone()
        .add(direction.clone().multiplyScalar(0.3));
      const targetBox = new Box3().setFromObject(targetRef.current);

      if (targetBox.containsPoint(arrowTipPosition)) {
        console.log("Hit!");

        arrowHitRef.current = true;
        velocityRef.current.set(0, 0, 0);

        moveToPosition(
          [
            targetRef.current.position.x - 3,
            targetRef.current.position.y,
            targetRef.current.position.z - 1,
          ],
          targetRef.current.position
        );
      }

      if (
        archerRefs.arrow1Ref.current.position.z > targetRef.current.position.z
      ) {
        console.log("arrow past target");
        reset();
      }
    }
  });

  return (
    <>
      <Archer {...archerRefs} />
      <Target targetRef={targetRef} />
    </>
  );
};
