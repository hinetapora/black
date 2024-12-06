"use client";

import { useFrame } from "@react-three/fiber";
import { Bloom, ChromaticAberration, EffectComposer } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const COUNT = 500;
const XY_BOUNDS = 40;
const Z_BOUNDS = 20;
const MAX_SPEED_FACTOR = 2;
const MAX_SCALE_FACTOR = 50;
const CHROMATIC_ABBERATION_OFFSET = 0.007;

export const Scene = ({ onWarpEnd }: { onWarpEnd?: () => void }) => {
  const meshRef = useRef<THREE.InstancedMesh | null>(null);
  const effectsRef = useRef<any>(null); // Explicitly using `any` for ChromaticAberrationEffect ref to avoid type mismatch.

  useEffect(() => {
    if (!meshRef.current) return;

    const tempObject = new THREE.Object3D();
    for (let i = 0; i < COUNT; i++) {
      tempObject.position.set(generatePos(), generatePos(), (Math.random() - 0.5) * Z_BOUNDS);
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const temp = new THREE.Matrix4();
    const tempPos = new THREE.Vector3();
    const tempObject = new THREE.Object3D();
    const tempColor = new THREE.Color();

    const velocity = Math.max(delta, Math.pow(0.5, state.clock.elapsedTime)); // Deceleration logic

    for (let i = 0; i < COUNT; i++) {
      meshRef.current.getMatrixAt(i, temp);

      // Update scale
      tempObject.scale.set(1, 1, Math.max(1, velocity * MAX_SCALE_FACTOR));

      // Update position
      tempPos.setFromMatrixPosition(temp);
      if (tempPos.z > Z_BOUNDS / 2) {
        tempPos.z = -Z_BOUNDS / 2; // Reset stars to the back
      } else {
        tempPos.z += Math.max(delta, velocity * MAX_SPEED_FACTOR); // Move stars forward
      }
      tempObject.position.set(tempPos.x, tempPos.y, tempPos.z);

      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);

      // Update color
      tempColor.setScalar(tempPos.z > 0 ? 1 : 1 - tempPos.z / (-Z_BOUNDS / 2));
      meshRef.current.setColorAt(i, tempColor);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;

    // Update Chromatic Aberration effect
    if (effectsRef.current) {
      const offsetValue = Math.max(0, Math.pow(0.5, state.clock.elapsedTime) * CHROMATIC_ABBERATION_OFFSET);
      effectsRef.current.offset.set(offsetValue, offsetValue);
    }

    // Trigger onWarpEnd callback after seconds <-------------------------------------------------
    if (state.clock.elapsedTime > 3 && onWarpEnd) {
      onWarpEnd();
    }
  });

  return (
    <>
      <color attach="background" args={["#000000"]} />
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, COUNT]}
        matrixAutoUpdate
      >
        <sphereGeometry args={[0.05]} />
        <meshBasicMaterial color={[1.5, 1.5, 1.5]} toneMapped={false} />
      </instancedMesh>
      <EffectComposer>
        <Bloom luminanceThreshold={0.2} mipmapBlur />
        <ChromaticAberration
          ref={effectsRef}
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(CHROMATIC_ABBERATION_OFFSET, CHROMATIC_ABBERATION_OFFSET)} radialModulation={false} modulationOffset={0}        />
      </EffectComposer>
    </>
  );
};

function generatePos() {
  return (Math.random() - 0.5) * XY_BOUNDS;
}
