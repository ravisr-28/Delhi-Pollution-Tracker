import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

// Auto-rotating Earth sphere
function Earth() {
  const meshRef = useRef();
  
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
      meshRef.current.rotation.x = Math.sin(Date.now() * 0.0003) * 0.1;
    }
  });

  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Ocean gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0a1628');
    gradient.addColorStop(0.3, '#0d2240');
    gradient.addColorStop(0.5, '#103050');
    gradient.addColorStop(0.7, '#0d2240');
    gradient.addColorStop(1, '#0a1628');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.15)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < canvas.width; i += 40) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 40) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
    }

    // Landmass blobs (simplified continents)
    const drawLand = (x, y, w, h, color) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2);
      ctx.fill();
    };

    // North America
    drawLand(230, 160, 80, 60, 'rgba(34, 197, 94, 0.3)');
    // South America
    drawLand(300, 320, 50, 70, 'rgba(234, 179, 8, 0.3)');
    // Europe
    drawLand(500, 150, 50, 40, 'rgba(59, 130, 246, 0.3)');
    // Africa
    drawLand(520, 270, 50, 70, 'rgba(249, 115, 22, 0.3)');
    // Asia
    drawLand(650, 170, 100, 60, 'rgba(239, 68, 68, 0.35)');
    // Australia
    drawLand(770, 350, 45, 30, 'rgba(34, 197, 94, 0.3)');

    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <group ref={meshRef}>
      <mesh>
        <sphereGeometry args={[2, 64, 64]} />
        <meshPhongMaterial
          map={earthTexture}
          transparent
          opacity={0.9}
          specular={new THREE.Color('#1a3a5c')}
          shininess={10}
        />
      </mesh>
      {/* Atmosphere glow */}
      <mesh scale={[1.08, 1.08, 1.08]}>
        <sphereGeometry args={[2, 64, 64]} />
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
              float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
              gl_FragColor = vec4(0.3, 0.5, 1.0, 1.0) * intensity;
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

// Floating particles
function Particles() {
  const count = 60;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return pos;
  }, []);

  const ref = useRef();
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.02;
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
      <pointsMaterial size={0.04} color="#4488ff" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

const DashboardGlobe = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 40 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        failIfMajorPerformanceCaveat: false,
      }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 3, 5]} intensity={0.8} color="#ffffff" />
      <directionalLight position={[-3, -2, -5]} intensity={0.2} color="#4488ff" />
      <Stars radius={50} depth={30} count={2000} factor={3} saturation={0} fade speed={0.5} />
      <Particles />
      <Earth />
    </Canvas>
  );
};

export default DashboardGlobe;