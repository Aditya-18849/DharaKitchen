"use client";

/**
 * ThaliScene — the hero's 3D centrepiece.
 *
 * A hand-modelled Indian thali (steel plate, katoris of dal and sabzi, a
 * mound of rice, rotis, salad, pickle) with ingredients floating around it.
 * Everything is procedural: no model downloads, no HDR fetches, so the scene
 * costs a few KB of geometry and starts instantly.
 *
 * This file is loaded with next/dynamic (ssr: false) from hero.tsx so three.js
 * never lands in the initial bundle.
 */

import { useEffect, useLayoutEffect, useMemo, useRef, type ReactNode, type RefObject } from "react";
import { Canvas, useFrame, useThree, type ThreeElements } from "@react-three/fiber";
import { ContactShadows, Environment, Float, Lightformer } from "@react-three/drei";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/** Small seeded PRNG so the food is arranged identically on every visit. */
function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const lathe = (points: [number, number][]) => points.map(([x, y]) => new THREE.Vector2(x, y));

interface ScatterProps {
  count: number;
  seed: number;
  radius: number;
  y?: number;
  size: number;
  color: string;
  shape?: "sphere" | "box";
  /** Vertical squash of each piece (1 = round). */
  flatten?: number;
  jitterY?: number;
  roughness?: number;
}

/** Instanced sprinkle of small pieces inside a disc — garnish, veg, seeds. */
function Scatter({
  count,
  seed,
  radius,
  y = 0,
  size,
  color,
  shape = "sphere",
  flatten = 1,
  jitterY = 0.01,
  roughness = 0.6,
}: ScatterProps) {
  const ref = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const rand = seeded(seed);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      const r = radius * Math.sqrt(rand());
      const angle = rand() * Math.PI * 2;
      dummy.position.set(Math.cos(angle) * r, y + rand() * jitterY, Math.sin(angle) * r);
      dummy.rotation.set(rand() * Math.PI, rand() * Math.PI, rand() * Math.PI);
      const s = size * (0.7 + rand() * 0.6);
      dummy.scale.set(s, s * flatten, s);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [count, seed, radius, y, size, flatten, jitterY]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} castShadow>
      {shape === "box" ? <boxGeometry args={[1, 1, 1]} /> : <sphereGeometry args={[0.5, 10, 8]} />}
      <meshStandardMaterial color={color} roughness={roughness} />
    </instancedMesh>
  );
}

/* ------------------------------------------------------------------ */
/* Steelware                                                           */
/* ------------------------------------------------------------------ */

function Steel({ tone = "#d9d6cf" }: { tone?: string }) {
  return (
    <meshStandardMaterial
      color={tone}
      metalness={0.92}
      roughness={0.22}
      envMapIntensity={1.15}
      side={THREE.DoubleSide}
    />
  );
}

function Plate() {
  const points = useMemo(
    () =>
      lathe([
        [0, 0],
        [1.84, 0],
        [1.96, 0.035],
        [2.2, 0.19],
        [2.32, 0.205],
        [2.335, 0.17],
      ]),
    [],
  );
  return (
    <group>
      <mesh receiveShadow castShadow>
        <latheGeometry args={[points, 96]} />
        <Steel />
      </mesh>
      {/* Faint spun-metal ring where the base meets the wall */}
      <mesh rotation-x={-Math.PI / 2} position-y={0.003}>
        <ringGeometry args={[1.72, 1.745, 96]} />
        <meshStandardMaterial color="#b9b6ae" metalness={0.9} roughness={0.35} />
      </mesh>
    </group>
  );
}

function Katori({
  position,
  scale = 1,
  fill,
  fillRoughness = 0.35,
  children,
}: {
  position: [number, number, number];
  scale?: number;
  fill: string;
  fillRoughness?: number;
  children?: ReactNode;
}) {
  const points = useMemo(
    () =>
      lathe([
        [0, 0],
        [0.3, 0],
        [0.41, 0.05],
        [0.48, 0.2],
        [0.5, 0.34],
        [0.53, 0.352],
      ]),
    [],
  );
  return (
    <group position={position} scale={scale}>
      <mesh castShadow receiveShadow>
        <latheGeometry args={[points, 56]} />
        <Steel tone="#dedbd4" />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={0.268} receiveShadow>
        <circleGeometry args={[0.487, 48]} />
        <meshStandardMaterial color={fill} roughness={fillRoughness} />
      </mesh>
      <group position-y={0.27}>{children}</group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Food                                                                */
/* ------------------------------------------------------------------ */

function Rice({ grains }: { grains: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const R = 0.62;
  const H = 0.3;

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const rand = seeded(11);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < grains; i++) {
      const r = R * Math.pow(rand(), 0.62);
      const angle = rand() * Math.PI * 2;
      const dome = H * (1 - (r / R) ** 2);
      dummy.position.set(Math.cos(angle) * r, dome + rand() * 0.03, Math.sin(angle) * r);
      dummy.rotation.set((rand() - 0.5) * 1.2, rand() * Math.PI, Math.PI / 2 + (rand() - 0.5) * 1.2);
      const s = 0.85 + rand() * 0.4;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [grains]);

  return (
    <group position={[-0.42, 0.02, 0.28]}>
      {/* Soft core so the mound reads as solid between grains */}
      <mesh scale={[R * 0.97, H * 0.95, R * 0.97]} castShadow>
        <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#efe7d3" roughness={0.9} />
      </mesh>
      <instancedMesh ref={ref} args={[undefined, undefined, grains]} castShadow>
        <capsuleGeometry args={[0.017, 0.062, 2, 6]} />
        <meshStandardMaterial color="#fbf6ea" roughness={0.55} />
      </instancedMesh>
      {/* A few coriander flecks on top */}
      <group position-y={H * 0.82}>
        <Scatter count={7} seed={5} radius={0.2} size={0.045} flatten={0.2} color="#4f7a2c" shape="box" />
      </group>
    </group>
  );
}

function useRotiTexture() {
  return useMemo(() => {
    const size = 512;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const rand = seeded(42);

    ctx.fillStyle = "#dcb681";
    ctx.fillRect(0, 0, size, size);

    // Pale floury patches
    for (let i = 0; i < 60; i++) {
      const x = rand() * size;
      const y = rand() * size;
      const r = 20 + rand() * 60;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, "rgba(240, 214, 168, 0.5)");
      g.addColorStop(1, "rgba(240, 214, 168, 0)");
      ctx.fillStyle = g;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }
    // Toasted char spots
    for (let i = 0; i < 46; i++) {
      const x = rand() * size;
      const y = rand() * size;
      const r = 6 + rand() * 26;
      const dark = rand() > 0.6;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, dark ? "rgba(92, 52, 22, 0.85)" : "rgba(150, 96, 48, 0.7)");
      g.addColorStop(0.6, dark ? "rgba(120, 72, 34, 0.45)" : "rgba(170, 116, 62, 0.3)");
      g.addColorStop(1, "rgba(170, 116, 62, 0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(x, y, r, r * (0.6 + rand() * 0.5), rand() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    return texture;
  }, []);
}

function rotiGeometry(seed: number, half = false) {
  const geometry = new THREE.CircleGeometry(0.76, 72, 0, half ? Math.PI : Math.PI * 2);
  geometry.rotateX(-Math.PI / 2);
  const position = geometry.attributes.position;
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    const z = position.getZ(i);
    const angle = Math.atan2(z, x);
    const wobble = 1 + 0.018 * Math.sin(angle * 5 + seed) + 0.012 * Math.sin(angle * 9 + seed * 2);
    position.setX(i, x * wobble);
    position.setZ(i, z * wobble);
    position.setY(i, 0.014 * Math.sin(x * 8 + seed) * Math.cos(z * 7 + seed));
  }
  geometry.computeVertexNormals();
  return geometry;
}

function Rotis() {
  const texture = useRotiTexture();
  const [a, b, folded] = useMemo(() => [rotiGeometry(1), rotiGeometry(4), rotiGeometry(7, true)], []);
  useEffect(
    () => () => {
      a.dispose();
      b.dispose();
      folded.dispose();
      texture.dispose();
    },
    [a, b, folded, texture],
  );

  const material = (
    <meshStandardMaterial map={texture} roughness={0.92} side={THREE.DoubleSide} />
  );

  return (
    <group position={[0.86, 0.02, 0.5]}>
      <mesh geometry={a} position={[0, 0.02, 0]} rotation-y={0.4} castShadow receiveShadow>
        {material}
      </mesh>
      <mesh geometry={b} position={[0.05, 0.05, -0.04]} rotation-y={2.1} castShadow receiveShadow>
        {material}
      </mesh>
      {/* Top roti folded in half */}
      <group position={[-0.02, 0.085, 0.03]} rotation-y={-0.65}>
        <mesh geometry={folded} castShadow receiveShadow>
          {material}
        </mesh>
        <mesh geometry={folded} position-y={0.03} rotation-x={0.07} castShadow>
          {material}
        </mesh>
      </group>
    </group>
  );
}

function Salad() {
  return (
    <group position={[-1.32, 0.03, -0.02]} rotation-y={0.5}>
      {/* Cucumber */}
      {[0, 1, 2].map((i) => (
        <group key={`c${i}`} position={[i * 0.13 - 0.13, 0.012 + i * 0.012, -0.24 + i * 0.03]} rotation={[0.16, 0, -0.1]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.158, 0.158, 0.026, 28]} />
            <meshStandardMaterial color="#4f7d33" roughness={0.6} />
          </mesh>
          <mesh position-y={0.002}>
            <cylinderGeometry args={[0.14, 0.14, 0.027, 28]} />
            <meshStandardMaterial color="#dbe9b3" roughness={0.45} />
          </mesh>
        </group>
      ))}
      {/* Tomato */}
      {[0, 1].map((i) => (
        <group key={`t${i}`} position={[i * 0.17 - 0.06, 0.02 + i * 0.014, 0.03]} rotation={[0.14, 0, -0.12]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.165, 0.165, 0.03, 28]} />
            <meshStandardMaterial color="#c43d29" roughness={0.3} />
          </mesh>
          <mesh position-y={0.002}>
            <cylinderGeometry args={[0.13, 0.13, 0.031, 6]} />
            <meshStandardMaterial color="#dd5f43" roughness={0.3} />
          </mesh>
        </group>
      ))}
      {/* Onion rings */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={`o${i}`}
          position={[i * 0.1 - 0.08, 0.03 + i * 0.012, 0.3 - i * 0.02]}
          rotation={[Math.PI / 2 - 0.15, 0, 0]}
          scale={1 - i * 0.14}
          castShadow
        >
          <torusGeometry args={[0.13, 0.017, 10, 36]} />
          <meshStandardMaterial color={i === 0 ? "#b06a94" : "#e7cfe0"} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function Pickle() {
  return (
    <group position={[-0.95, 0.02, 1.12]}>
      <mesh rotation-x={-Math.PI / 2} position-y={0.004}>
        <circleGeometry args={[0.25, 28]} />
        <meshStandardMaterial color="#a8401a" roughness={0.18} />
      </mesh>
      <Scatter count={9} seed={23} radius={0.17} y={0.035} size={0.11} flatten={0.7} color="#8f2c14" roughness={0.22} jitterY={0.04} />
      <Scatter count={10} seed={29} radius={0.2} y={0.05} size={0.022} color="#2d2114" jitterY={0.05} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Loose ingredients                                                   */
/* ------------------------------------------------------------------ */

function useChiliGeometry() {
  return useMemo(() => {
    const geometry = new THREE.LatheGeometry(
      lathe([
        [0, 0],
        [0.04, 0.03],
        [0.055, 0.2],
        [0.05, 0.5],
        [0.03, 0.8],
        [0, 0.98],
      ]),
      14,
    );
    // Gentle bend so it doesn't look machined
    const position = geometry.attributes.position;
    for (let i = 0; i < position.count; i++) {
      const y = position.getY(i);
      position.setX(i, position.getX(i) + 0.16 * y * y);
    }
    geometry.computeVertexNormals();
    geometry.translate(-0.05, -0.5, 0);
    return geometry;
  }, []);
}

function Chili({ color, ...props }: { color: string } & ThreeElements["group"]) {
  const geometry = useChiliGeometry();
  return (
    <group {...props}>
      <mesh geometry={geometry} castShadow>
        <meshStandardMaterial color={color} roughness={0.28} />
      </mesh>
      <mesh position={[-0.05, -0.55, 0]} rotation-z={0.2}>
        <cylinderGeometry args={[0.012, 0.02, 0.14, 8]} />
        <meshStandardMaterial color="#5a6b2c" roughness={0.7} />
      </mesh>
    </group>
  );
}

function useLeafGeometry() {
  return useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.quadraticCurveTo(-0.32, 0.05, -0.34, 0.3);
    shape.quadraticCurveTo(-0.2, 0.28, -0.17, 0.42);
    shape.quadraticCurveTo(-0.2, 0.66, 0, 0.76);
    shape.quadraticCurveTo(0.2, 0.66, 0.17, 0.42);
    shape.quadraticCurveTo(0.2, 0.28, 0.34, 0.3);
    shape.quadraticCurveTo(0.32, 0.05, 0, 0);
    const geometry = new THREE.ShapeGeometry(shape, 10);
    const position = geometry.attributes.position;
    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const y = position.getY(i);
      position.setZ(i, 0.55 * x * x - 0.12 * y * y);
    }
    geometry.computeVertexNormals();
    geometry.translate(0, -0.35, 0);
    return geometry;
  }, []);
}

function Leaf(props: ThreeElements["group"]) {
  const geometry = useLeafGeometry();
  return (
    <group {...props}>
      <mesh geometry={geometry} castShadow>
        <meshStandardMaterial color="#4c7a2e" roughness={0.55} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.008, 0.012, 0.32, 6]} />
        <meshStandardMaterial color="#6d8f3e" roughness={0.6} />
      </mesh>
    </group>
  );
}

function Tomato({ radius = 0.24, ...props }: { radius?: number } & ThreeElements["group"]) {
  return (
    <group {...props}>
      <mesh scale={[radius, radius * 0.9, radius]} castShadow>
        <sphereGeometry args={[1, 32, 24]} />
        <meshStandardMaterial color="#c8391f" roughness={0.2} />
      </mesh>
      <mesh position-y={radius * 0.86} rotation-y={0.4}>
        <coneGeometry args={[radius * 0.34, radius * 0.1, 5]} />
        <meshStandardMaterial color="#3f6a2a" roughness={0.6} />
      </mesh>
    </group>
  );
}

function Peppercorn(props: ThreeElements["mesh"]) {
  return (
    <mesh {...props} castShadow>
      <icosahedronGeometry args={[0.05, 1]} />
      <meshStandardMaterial color="#2a2018" roughness={0.75} />
    </mesh>
  );
}

function FloatingIngredients({
  still,
  pointer,
}: {
  still: boolean;
  pointer: RefObject<{ x: number; y: number }>;
}) {
  const group = useRef<THREE.Group>(null);

  // The loose ingredients sit on a nearer "layer": they drift further than
  // the plate as the pointer moves, which is what sells the depth.
  useFrame((_, delta) => {
    if (!group.current || still) return;
    const p = pointer.current;
    group.current.position.x = THREE.MathUtils.damp(group.current.position.x, p.x * 0.22, 3, delta);
    group.current.position.z = THREE.MathUtils.damp(group.current.position.z, p.y * 0.16, 3, delta);
  });

  const float = (speed: number, intensity = 0.7) => ({
    speed: still ? 0 : speed,
    rotationIntensity: still ? 0 : 0.7,
    floatIntensity: still ? 0 : intensity,
    floatingRange: [-0.08, 0.08] as [number, number],
  });

  return (
    <group ref={group}>
      <Float {...float(1.3)}>
        <Leaf position={[-2.3, 1.0, -1.9]} rotation={[-0.9, 0.4, 0.5]} scale={0.74} />
      </Float>
      <Float {...float(1.0)}>
        <Leaf position={[2.25, 1.35, -1.95]} rotation={[-0.7, -0.5, -0.6]} scale={0.62} />
      </Float>
      <Float {...float(1.5, 0.9)}>
        <Leaf position={[2.85, 0.7, 1.2]} rotation={[-1.1, 0.2, -0.3]} scale={0.56} />
      </Float>
      <Float {...float(0.9)}>
        <Tomato position={[-2.25, 1.0, 2.0]} radius={0.26} rotation={[0.3, 0, 0.3]} />
      </Float>
      <Float {...float(1.2)}>
        <Tomato position={[2.8, 0.95, -0.45]} radius={0.2} rotation={[-0.2, 0, -0.4]} />
      </Float>
      <Float {...float(1.1, 0.9)}>
        <Chili color="#b9281a" position={[2.1, 0.75, 2.3]} rotation={[1.2, 0.3, 0.9]} scale={0.95} />
      </Float>
      <Float {...float(1.4)}>
        <Chili color="#4d7f2a" position={[-0.5, 0.7, 2.75]} rotation={[1.3, -0.4, -1.2]} scale={0.85} />
      </Float>
      <Float {...float(1.6, 1)}>
        <Peppercorn position={[-1.3, 1.25, -2.55]} />
      </Float>
      <Float {...float(1.2, 1)}>
        <Peppercorn position={[0.7, 1.5, -2.7]} scale={0.8} />
      </Float>
      <Float {...float(1.8, 1)}>
        <Peppercorn position={[-2.7, 1.3, -0.9]} scale={0.7} />
      </Float>
      <Float {...float(1.5, 1)}>
        <Peppercorn position={[2.95, 1.25, 0.35]} scale={0.9} />
      </Float>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* The thali                                                           */
/* ------------------------------------------------------------------ */

function Thali({ grains }: { grains: number }) {
  return (
    <group>
      <Plate />

      {/* Dal */}
      <Katori position={[-1.08, 0.01, -0.98]} fill="#dc9a2a" fillRoughness={0.25}>
        <Scatter count={5} seed={3} radius={0.3} size={0.06} flatten={0.3} color="#8d2a14" />
        <Scatter count={9} seed={8} radius={0.36} size={0.035} flatten={0.25} color="#4f7a2c" shape="box" />
        <Scatter count={14} seed={13} radius={0.38} size={0.016} color="#2b1c10" />
      </Katori>

      {/* Mixed vegetable sabzi */}
      <Katori position={[0.02, 0.01, -1.4]} fill="#7a8b3a" fillRoughness={0.6}>
        <Scatter count={16} seed={17} radius={0.33} size={0.1} color="#dcb44e" shape="box" jitterY={0.05} flatten={0.8} />
        <Scatter count={16} seed={19} radius={0.36} size={0.05} color="#5c9a3a" jitterY={0.07} />
        <Scatter count={9} seed={21} radius={0.33} size={0.075} color="#d9762b" shape="box" jitterY={0.06} />
      </Katori>

      {/* Paneer in tomato gravy */}
      <Katori position={[1.12, 0.01, -0.95]} fill="#c0562a" fillRoughness={0.22}>
        <Scatter count={8} seed={31} radius={0.3} size={0.12} color="#f4e8cc" shape="box" jitterY={0.02} flatten={0.75} roughness={0.5} />
        <Scatter count={7} seed={33} radius={0.34} size={0.03} flatten={0.25} color="#4f7a2c" shape="box" />
        <mesh rotation-x={-Math.PI / 2} position-y={0.004}>
          <torusGeometry args={[0.2, 0.012, 6, 40, Math.PI * 1.3]} />
          <meshStandardMaterial color="#f6ead2" roughness={0.3} />
        </mesh>
      </Katori>

      <Rice grains={grains} />
      <Rotis />
      <Salad />
      <Pickle />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Rig, lights, camera                                                 */
/* ------------------------------------------------------------------ */

function ResponsiveCamera() {
  const camera = useThree((state) => state.camera);
  const aspect = useThree((state) => state.size.width / state.size.height);

  useLayoutEffect(() => {
    // Pull the camera back on narrow canvases so nothing is clipped.
    const factor = aspect < 1.08 ? Math.min(1.08 / aspect, 1.6) : 1;
    camera.position.set(0, 7.6 * factor, 7.2 * factor);
    camera.lookAt(0, 0.15, 0.1);
    camera.updateProjectionMatrix();
  }, [aspect, camera]);

  return null;
}

function Rig({
  children,
  still,
  pointer,
}: {
  children: ReactNode;
  still: boolean;
  pointer: RefObject<{ x: number; y: number }>;
}) {
  const group = useRef<THREE.Group>(null);
  const entrance = useRef(still ? 1 : 0);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    if (still) {
      g.scale.setScalar(1);
      return;
    }
    entrance.current = THREE.MathUtils.damp(entrance.current, 1, 2.4, delta);
    const e = entrance.current;
    const p = pointer.current;
    const t = state.clock.elapsedTime;

    g.scale.setScalar(0.8 + 0.2 * e);
    g.position.y = -(1 - e) * 0.7;
    g.rotation.y = THREE.MathUtils.damp(
      g.rotation.y,
      p.x * 0.2 + Math.sin(t * 0.28) * 0.07 - (1 - e) * 1.1,
      3.2,
      delta,
    );
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, p.y * 0.07, 3.2, delta);
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, -p.x * 0.03, 3.2, delta);
  });

  return (
    <group ref={group} scale={still ? 1 : 0.8}>
      {children}
    </group>
  );
}

export interface ThaliSceneProps {
  /** Render the animation loop (false pauses it while off-screen). */
  active?: boolean;
  /** Disable all motion (prefers-reduced-motion). */
  still?: boolean;
  /** Lighter settings for phones. */
  lowPower?: boolean;
  onReady?: () => void;
}

export default function ThaliScene({ active = true, still = false, lowPower = false, onReady }: ThaliSceneProps) {
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (still) return;
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [still]);

  return (
    <Canvas
      shadows={!lowPower}
      dpr={lowPower ? [1, 1.5] : [1, 1.75]}
      frameloop={still ? "demand" : active ? "always" : "never"}
      camera={{ fov: 35, near: 0.1, far: 60, position: [0, 7.6, 7.2] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={() => onReady?.()}
      style={{ pointerEvents: "none" }}
      aria-hidden
    >
      <ResponsiveCamera />

      <ambientLight intensity={0.5} color="#fff3df" />
      <directionalLight
        position={[-4.5, 7.5, 3.5]}
        intensity={2.3}
        color="#fff0d8"
        castShadow={!lowPower}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      >
        <orthographicCamera attach="shadow-camera" args={[-4, 4, 4, -4, 0.5, 20]} />
      </directionalLight>
      <directionalLight position={[5, 3, -4]} intensity={0.5} color="#dfe8d0" />

      {/* Studio-style environment built from light cards — nothing to download. */}
      <Environment resolution={256} frames={1}>
        <mesh scale={40}>
          <sphereGeometry args={[1, 24, 16]} />
          <meshBasicMaterial color="#b9ad96" side={THREE.BackSide} />
        </mesh>
        <Lightformer form="rect" intensity={3.2} color="#fff6e6" position={[0, 8, 0]} rotation-x={Math.PI / 2} scale={[12, 12, 1]} />
        <Lightformer form="rect" intensity={2.2} color="#ffd9ae" position={[-8, 3, 3]} rotation-y={Math.PI / 2} scale={[8, 5, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#e3ecd6" position={[8, 2.5, -3]} rotation-y={-Math.PI / 2} scale={[8, 4, 1]} />
        <Lightformer form="ring" intensity={1.6} color="#fff1dc" position={[2, 5, 6]} scale={3} />
      </Environment>

      <Rig still={still} pointer={pointer}>
        <Thali grains={lowPower ? 620 : 1150} />
        <FloatingIngredients still={still} pointer={pointer} />
        <ContactShadows
          position={[0, -0.02, 0]}
          scale={11}
          far={0.7}
          blur={2.8}
          opacity={0.42}
          resolution={lowPower ? 256 : 512}
          color="#2b2114"
          frames={still ? 1 : Infinity}
        />
      </Rig>
    </Canvas>
  );
}
