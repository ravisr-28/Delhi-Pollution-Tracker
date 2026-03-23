import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

// Scroll-reactive auto-rotating Earth
function Earth({ scrollProgress = 0 }) {
  const meshRef = useRef();

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    // Base rotation + scroll-boosted rotation
    const scrollBoost = 1 + scrollProgress * 2;
    meshRef.current.rotation.y += delta * 0.12 * scrollBoost;
    // Gentle tilt wobble
    meshRef.current.rotation.x = Math.sin(Date.now() * 0.0003) * 0.08;
    // Scroll-driven vertical shift (move up as user scrolls)
    meshRef.current.position.y = -scrollProgress * 1.5;
  });

  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Deep ocean gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#050d1a');
    gradient.addColorStop(0.2, '#0a1e3d');
    gradient.addColorStop(0.4, '#0c2848');
    gradient.addColorStop(0.5, '#0e3055');
    gradient.addColorStop(0.6, '#0c2848');
    gradient.addColorStop(0.8, '#0a1e3d');
    gradient.addColorStop(1, '#050d1a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle grid lines
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.08)';
    ctx.lineWidth = 0.8;
    for (let i = 0; i < canvas.width; i += 64) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 64) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
    }

    // Landmasses (stylized continents)
    const drawLand = (x, y, w, h, color, glow) => {
      // Glow
      const grad = ctx.createRadialGradient(x, y, 0, x, y, Math.max(w, h) * 1.4);
      grad.addColorStop(0, glow);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(x, y, w * 1.4, h * 1.4, 0, 0, Math.PI * 2);
      ctx.fill();
      // Land
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2);
      ctx.fill();
    };

    // North America
    drawLand(440, 300, 160, 110, 'rgba(34, 197, 94, 0.35)', 'rgba(34, 197, 94, 0.08)');
    // South America
    drawLand(580, 620, 90, 140, 'rgba(234, 179, 8, 0.3)', 'rgba(234, 179, 8, 0.06)');
    // Europe
    drawLand(980, 280, 90, 70, 'rgba(59, 130, 246, 0.35)', 'rgba(59, 130, 246, 0.08)');
    // Africa
    drawLand(1020, 520, 100, 140, 'rgba(249, 115, 22, 0.35)', 'rgba(249, 115, 22, 0.07)');
    // Asia
    drawLand(1300, 320, 200, 120, 'rgba(239, 68, 68, 0.35)', 'rgba(239, 68, 68, 0.08)');
    // India
    drawLand(1250, 440, 60, 70, 'rgba(239, 68, 68, 0.45)', 'rgba(239, 68, 68, 0.1)');
    // Australia
    drawLand(1540, 680, 90, 60, 'rgba(34, 197, 94, 0.3)', 'rgba(34, 197, 94, 0.06)');

    // City hot-spots (tiny bright dots)
    const cities = [
      [430, 310, '#22c55e'], [560, 300, '#22c55e'],  // US cities
      [990, 280, '#3b82f6'], [960, 310, '#3b82f6'],  // Europe
      [1250, 440, '#ef4444'], [1350, 350, '#ef4444'], // Asia
      [1020, 480, '#f97316'],                          // Africa
    ];
    cities.forEach(([cx, cy, col]) => {
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fill();
      // glow ring
      ctx.strokeStyle = col.replace(')', ', 0.3)').replace('rgb', 'rgba');
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx.stroke();
    });

    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <group ref={meshRef}>
      {/* Main Earth Sphere */}
      <mesh>
        <sphereGeometry args={[2.2, 64, 64]} />
        <meshPhongMaterial
          map={earthTexture}
          transparent
          opacity={0.92}
          specular={new THREE.Color('#1a3a5c')}
          shininess={15}
        />
      </mesh>
      {/* Atmosphere glow (inner) */}
      <mesh scale={[1.05, 1.05, 1.05]}>
        <sphereGeometry args={[2.2, 64, 64]} />
        <shaderMaterial
          vertexShader={`
            varying vec3 vNormal;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            varying vec3 vNormal;
            void main() {
              float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
              gl_FragColor = vec4(0.25, 0.55, 1.0, 1.0) * intensity * 1.2;
            }
          `}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          transparent
        />
      </mesh>
      {/* Outer atmosphere haze */}
      <mesh scale={[1.15, 1.15, 1.15]}>
        <sphereGeometry args={[2.2, 64, 64]} />
        <shaderMaterial
          vertexShader={`
            varying vec3 vNormal;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            varying vec3 vNormal;
            void main() {
              float intensity = pow(0.5 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
              gl_FragColor = vec4(0.15, 0.35, 0.9, 0.4) * intensity;
            }
          `}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          transparent
        />
      </mesh>
    </group>
  );
}

// Floating orbital particles
function Particles() {
  const count = 80;
  const ref = useRef();

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3.5 + Math.random() * 4;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.015;
      ref.current.rotation.x += delta * 0.005;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#6699ff" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

// Connection arcs between cities
function ConnectionArcs() {
  const ref = useRef();
  
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.08;
    }
  });

  const arcs = useMemo(() => {
    const lines = [];
    const pairs = [
      [0.5, 0.7, 0.4, -0.3, 0.8, 0.5],
      [-0.6, 0.3, 0.7, 0.4, 0.5, 0.8],
      [0.2, -0.5, 0.8, -0.7, 0.2, 0.7],
    ];
    pairs.forEach(([x1, y1, z1, x2, y2, z2]) => {
      const points = [];
      for (let t = 0; t <= 1; t += 0.05) {
        const x = x1 + (x2 - x1) * t;
        const y = y1 + (y2 - y1) * t + Math.sin(t * Math.PI) * 0.8;
        const z = z1 + (z2 - z1) * t;
        const r = 2.3;
        const len = Math.sqrt(x * x + y * y + z * z);
        points.push(new THREE.Vector3(x / len * r, y / len * r + Math.sin(t * Math.PI) * 0.6, z / len * r));
      }
      const curve = new THREE.CatmullRomCurve3(points);
      lines.push(curve.getPoints(30));
    });
    return lines;
  }, []);

  return (
    <group ref={ref}>
      {arcs.map((points, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={points.length}
              array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#3b82f6" transparent opacity={0.2} />
        </line>
      ))}
    </group>
  );
}

export default function EarthGlobe({ scrollProgress = 0 }) {
  // Scroll-reactive camera zoom
  const cameraZ = 5.8 - scrollProgress * 0.8;

  return (
    <Canvas
      camera={{ position: [0, 0, cameraZ], fov: 42 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        failIfMajorPerformanceCaveat: false,
      }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.25} />
      <directionalLight position={[5, 3, 5]} intensity={0.9} color="#ffffff" />
      <directionalLight position={[-4, -2, -5]} intensity={0.3} color="#4488ff" />
      <pointLight position={[0, 5, 0]} intensity={0.2} color="#8b5cf6" />
      <Stars radius={60} depth={40} count={3000} factor={3} saturation={0} fade speed={0.4} />
      <Particles />
      <ConnectionArcs />
      <Earth scrollProgress={scrollProgress} />
    </Canvas>
  );
}