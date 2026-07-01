/** @jsxImportSource react */

import { OrbitControls, Plane, SoftShadows } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
  Bloom,
  BrightnessContrast,
  EffectComposer,
  HueSaturation,
} from "@react-three/postprocessing";
import { useRef, useState } from "react";
import { DoubleSide } from "three";

const vertexShader = /* glsl */ `
varying vec3 vPosition;
void main() {
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = /* glsl */ `
varying vec3 vPosition;
void main() {
  gl_FragColor = vec4(vPosition, 0.8);
}
`;

export function SphereOctant() {
  const tooltipRef = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative rounded-lg border-2 border-gray-100 dark:border-gray-800"
      style={{ width: "auto", maxWidth: "100%", height: "300px" }}
    >
      <Canvas camera={{ fov: 25 }} shadows>
        <SoftShadows samples={20} />
        {/* eslint-disable-next-line react/no-unknown-property -- react-three-fiber element props, not DOM attributes */}
        <group position={[-0.25, -0.4, -0.25]} rotation={[0, -Math.PI / 9, 0]}>
          <mesh
            // eslint-disable-next-line react/no-unknown-property -- react-three-fiber element prop, not a DOM attribute
            castShadow
            onPointerOver={() => setIsHovered(true)}
            onPointerOut={() => setIsHovered(false)}
            onPointerMove={(event) => {
              const tooltip = tooltipRef.current;

              const intersection = event.intersections[0];
              if (tooltip && intersection) {
                const container = tooltip.parentElement!;
                const v = intersection.eventObject.worldToLocal(
                  intersection.point,
                );
                tooltip.textContent =
                  v
                    .toArray()
                    .map((n) => n.toFixed(2) + "²")
                    .join(" + ") + ` ≈ 1`;

                const bounding = container.getBoundingClientRect();

                tooltip.style.transform = `translate3d(${
                  event.clientX - bounding.x
                }px, ${event.clientY - bounding.y}px, 0)`;
              }
            }}
          >
            <sphereGeometry
              // eslint-disable-next-line react/no-unknown-property -- react-three-fiber element prop, not a DOM attribute
              args={[1, 16, 16, 0, -Math.PI / 2, 0, -Math.PI / 2]}
            />
            <shaderMaterial
              // eslint-disable-next-line react/no-unknown-property -- react-three-fiber element prop, not a DOM attribute
              transparent
              // eslint-disable-next-line react/no-unknown-property -- react-three-fiber element prop, not a DOM attribute
              fragmentShader={fragmentShader}
              // eslint-disable-next-line react/no-unknown-property -- react-three-fiber element prop, not a DOM attribute
              vertexShader={vertexShader}
              // eslint-disable-next-line react/no-unknown-property -- react-three-fiber element prop, not a DOM attribute
              side={DoubleSide}
            />
          </mesh>
          <axesHelper />
        </group>
        {/* eslint-disable-next-line react/no-unknown-property -- react-three-fiber element props, not DOM attributes */}
        <directionalLight position={[1.5, 4, 2]} intensity={0.5} castShadow />
        <Plane
          args={[100, 100]}
          receiveShadow
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.4, 0]}
        >
          {/* eslint-disable-next-line react/no-unknown-property -- react-three-fiber element prop, not a DOM attribute */}
          <shadowMaterial transparent opacity={0.2} color="#444" />
        </Plane>
        <EffectComposer>
          <Bloom mipmapBlur luminanceThreshold={1} />
          <BrightnessContrast brightness={0} contrast={0.1} />
          <HueSaturation hue={0} saturation={-0.25} />
        </EffectComposer>
        <OrbitControls
          autoRotate={!isHovered}
          autoRotateSpeed={0.25}
          maxPolarAngle={(3.5 * Math.PI) / 8}
          minPolarAngle={(2 * Math.PI) / 8}
        />
      </Canvas>
      <span
        className="pointer-events-none absolute -top-5 left-1.5 -mx-1.5 -my-0.5 rounded-sm px-1.5 py-0.5 font-mono text-sm select-none dark:bg-black/10 dark:font-medium dark:text-white"
        ref={tooltipRef}
        style={{
          display: isHovered ? "block" : "none",
        }}
      />
    </div>
  );
}
