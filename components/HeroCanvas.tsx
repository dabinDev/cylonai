"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

interface HeroCanvasProps {
  scrollY: number;
}

// Deep nebula layer - slow gray particles
function NebulaLayer({ scrollProgress }: { scrollProgress: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 3000;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 40;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 30;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20 - 10;
    }
    return arr;
  }, []);

  const speeds = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 0.003,
      y: (Math.random() - 0.5) * 0.003,
      phase: Math.random() * Math.PI * 2,
    }));
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const convergence = Math.min(1, scrollProgress * 2);

    for (let i = 0; i < count; i++) {
      const baseX = particles[i * 3];
      const baseY = particles[i * 3 + 1];
      const baseZ = particles[i * 3 + 2];
      const s = speeds[i];

      // Breathing movement
      let x = baseX + Math.sin(t * s.x * 10 + s.phase) * 0.5;
      let y = baseY + Math.cos(t * s.y * 10 + s.phase) * 0.5;
      let z = baseZ + Math.sin(t * 0.3 + s.phase) * 0.3;

      // Scroll convergence - particles move toward center
      if (convergence > 0) {
        x = THREE.MathUtils.lerp(x, 0, convergence * 0.8);
        y = THREE.MathUtils.lerp(y, 0, convergence * 0.8);
        z = THREE.MathUtils.lerp(z, 5, convergence * 0.5);
      }

      dummy.position.set(x, y, z);
      const scale = (0.02 + Math.sin(t + s.phase) * 0.01) * (1 - convergence * 0.5);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#6b7b99" transparent opacity={0.5} />
    </instancedMesh>
  );
}

// Mid layer - flowing blue lights
function MidLayer({ scrollProgress }: { scrollProgress: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 2000;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 30;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5;
    }
    return arr;
  }, []);

  const speeds = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 0.008,
      y: (Math.random() - 0.5) * 0.008,
      phase: Math.random() * Math.PI * 2,
      brightness: Math.random() * 0.5 + 0.5,
    }));
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const convergence = Math.min(1, scrollProgress * 2);

    for (let i = 0; i < count; i++) {
      const baseX = particles[i * 3];
      const baseY = particles[i * 3 + 1];
      const baseZ = particles[i * 3 + 2];
      const s = speeds[i];

      let x = baseX + Math.sin(t * 0.5 + s.phase) * 1.5;
      let y = baseY + Math.cos(t * 0.4 + s.phase) * 1.2;
      let z = baseZ + Math.sin(t * 0.3 + s.phase * 2) * 0.8;

      if (convergence > 0) {
        x = THREE.MathUtils.lerp(x, 0, convergence * 0.85);
        y = THREE.MathUtils.lerp(y, 0, convergence * 0.85);
        z = THREE.MathUtils.lerp(z, 3, convergence * 0.6);
      }

      dummy.position.set(x, y, z);
      const pulse = Math.sin(t * 2 + s.phase) * 0.3 + 0.7;
      const scale = 0.025 * s.brightness * pulse * (1 - convergence * 0.3);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#38bdf8" transparent opacity={0.85} />
    </instancedMesh>
  );
}

// Top layer - bright crystal particles (reactive to mouse)
function CrystalLayer({ scrollProgress, mousePos }: { scrollProgress: number; mousePos: React.MutableRefObject<{ x: number; y: number }> }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 800;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const { viewport } = useThree();

  const particles = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 25;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return arr;
  }, []);

  const speeds = useMemo(() => {
    return Array.from({ length: count }, () => ({
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.01 + 0.005,
      brightness: Math.random() * 0.5 + 0.5,
    }));
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const convergence = Math.min(1, scrollProgress * 2);
    const mx = (mousePos.current.x / window.innerWidth - 0.5) * viewport.width;
    const my = -(mousePos.current.y / window.innerHeight - 0.5) * viewport.height;

    for (let i = 0; i < count; i++) {
      const baseX = particles[i * 3];
      const baseY = particles[i * 3 + 1];
      const baseZ = particles[i * 3 + 2];
      const s = speeds[i];

      let x = baseX + Math.sin(t * s.speed * 20 + s.phase) * 2;
      let y = baseY + Math.cos(t * s.speed * 15 + s.phase) * 1.5;
      let z = baseZ;

      // Mouse attraction
      const dx = mx - x;
      const dy = my - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 5 && dist > 0) {
        const force = (5 - dist) / 5;
        x += dx * force * 0.1;
        y += dy * force * 0.1;
      }

      if (convergence > 0) {
        x = THREE.MathUtils.lerp(x, 0, convergence * 0.9);
        y = THREE.MathUtils.lerp(y, 0, convergence * 0.9);
        z = THREE.MathUtils.lerp(z, 2, convergence * 0.7);
      }

      dummy.position.set(x, y, z);
      const pulse = Math.sin(t * 3 + s.phase) * 0.4 + 0.6;
      const scale = 0.035 * s.brightness * pulse;
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <octahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color="#bae6fd" transparent opacity={1} />
    </instancedMesh>
  );
}

// Logo text that appears during convergence
function LogoReveal({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const show = scrollProgress > 0.3 && scrollProgress < 0.8;
    groupRef.current.visible = show;
    if (show) {
      const t = (scrollProgress - 0.3) / 0.5;
      groupRef.current.scale.setScalar(t * 1.5);
      const mat = (groupRef.current.children[0] as THREE.Mesh).material as THREE.MeshBasicMaterial;
      mat.opacity = t * 0.8;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 5]}>
      <mesh>
        <planeGeometry args={[8, 2]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// Connection lines between nearby particles
function ConnectionLines({ scrollProgress }: { scrollProgress: number }) {
  const linesRef = useRef<THREE.LineSegments>(null);
  const lineCount = 200;

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(lineCount * 6);
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (!linesRef.current) return;
    const t = clock.getElapsedTime();
    const positions = geometry.attributes.position.array as Float32Array;
    const convergence = Math.min(1, scrollProgress * 2);

    for (let i = 0; i < lineCount; i++) {
      const angle1 = (i / lineCount) * Math.PI * 2 + t * 0.1;
      const angle2 = angle1 + 0.5 + Math.sin(t + i) * 0.3;
      const r1 = 5 + Math.sin(t * 0.5 + i) * 3;
      const r2 = 5 + Math.cos(t * 0.4 + i * 2) * 3;

      let x1 = Math.cos(angle1) * r1;
      let y1 = Math.sin(angle1) * r1 * 0.6;
      let x2 = Math.cos(angle2) * r2;
      let y2 = Math.sin(angle2) * r2 * 0.6;

      if (convergence > 0) {
        x1 = THREE.MathUtils.lerp(x1, 0, convergence);
        y1 = THREE.MathUtils.lerp(y1, 0, convergence);
        x2 = THREE.MathUtils.lerp(x2, 0, convergence);
        y2 = THREE.MathUtils.lerp(y2, 0, convergence);
      }

      positions[i * 6] = x1;
      positions[i * 6 + 1] = y1;
      positions[i * 6 + 2] = 0;
      positions[i * 6 + 3] = x2;
      positions[i * 6 + 4] = y2;
      positions[i * 6 + 5] = 0;
    }
    geometry.attributes.position.needsUpdate = true;
  });

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial color="#38bdf8" transparent opacity={0.15} />
    </lineSegments>
  );
}

function Scene({ scrollProgress, mousePos }: { scrollProgress: number; mousePos: React.MutableRefObject<{ x: number; y: number }> }) {
  return (
    <>
      <color attach="background" args={["#060a14"]} />
      <fog attach="fog" args={["#060a14", 10, 40]} />

      <NebulaLayer scrollProgress={scrollProgress} />
      <MidLayer scrollProgress={scrollProgress} />
      <CrystalLayer scrollProgress={scrollProgress} mousePos={mousePos} />
      <ConnectionLines scrollProgress={scrollProgress} />
      <LogoReveal scrollProgress={scrollProgress} />

      <EffectComposer>
        <Bloom
          intensity={2.0}
          luminanceThreshold={0.05}
          luminanceSmoothing={0.8}
          radius={0.9}
        />
      </EffectComposer>
    </>
  );
}

export default function HeroCanvas({ scrollY }: HeroCanvasProps) {
  const mousePos = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Calculate scroll progress (0 to 1) within the hero section
  const scrollProgress = Math.min(1, scrollY / (typeof window !== "undefined" ? window.innerHeight : 800));

  return (
    <div ref={containerRef} className="relative w-full h-screen">
      {/* Three.js Canvas */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 15], fov: 60 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: false }}
        >
          <Scene scrollProgress={scrollProgress} mousePos={mousePos} />
        </Canvas>
      </div>

      {/* Overlay text */}
      <div
        className="relative z-10 flex flex-col items-center justify-center h-full px-4 pointer-events-none"
        style={{
          opacity: Math.max(0, 1 - scrollProgress * 2),
          transform: `translateY(${scrollProgress * -50}px)`,
        }}
      >
        <div className="mb-6 animate-fade-in">
          <div className="inline-block px-5 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-sm text-cyan-300 text-sm font-medium tracking-wider">
            AIGC驱动 &middot; 智能创作 &middot; 无限可能
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 animate-slide-up leading-tight text-center">
          <span className="text-white">拾光AI</span>
        </h1>

        <div className="relative mb-8 animate-slide-up animate-delay-200">
          <h2
            className="text-3xl md:text-5xl lg:text-6xl font-black text-center"
            style={{
              background: "linear-gradient(90deg, #38bdf8, #818cf8, #c084fc, #38bdf8)",
              backgroundSize: "300% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "gradientFlow 4s linear infinite",
            }}
          >
            轻松创作优质、高效内容
          </h2>
        </div>

        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8 animate-slide-up animate-delay-300 leading-relaxed text-center">
          一站式AIGC内容创作服务，涵盖AIGC短剧、AIGC广告宣传片、AIGC创作培训、AI智能体搭建
        </p>

        {/* Scroll down hint */}
        <div className="animate-slide-up animate-delay-400 flex flex-col items-center gap-2">
          <span className="text-gray-500 text-sm tracking-widest uppercase">Scroll to explore</span>
          <svg className="w-5 h-5 text-cyan-400/50 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce"
        style={{ opacity: Math.max(0, 1 - scrollProgress * 4) }}
      >
        <svg className="w-6 h-6 text-cyan-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>

      {/* Stats bar */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 py-8 px-4"
        style={{
          background: "linear-gradient(180deg, transparent 0%, #060a14 100%)",
          opacity: Math.max(0, 1 - scrollProgress * 3),
        }}
      >
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: "10万+", label: "创作者" },
            { value: "100万+", label: "作品产出" },
            { value: "99%", label: "满意度" },
            { value: "24/7", label: "技术支持" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-black" style={{ background: "linear-gradient(90deg, #38bdf8, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {stat.value}
              </div>
              <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
      `}</style>
    </div>
  );
}
