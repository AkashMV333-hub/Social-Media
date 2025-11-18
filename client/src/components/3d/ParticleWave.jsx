import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function WaveParticles() {
  const pointsRef = useRef();
  const count = 15000; // MASSIVE amount of particles

  // Create grid of particles
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const gridSize = 100;
    const gap = 0.5;
    let index = 0;

    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        if (index >= count) break;

        positions[index * 3] = (x - gridSize / 2) * gap;
        positions[index * 3 + 1] = 0;
        positions[index * 3 + 2] = (z - gridSize / 2) * gap;

        /* Rainbow colors
        const color = new THREE.Color();
        color.setHSL((x / gridSize + z / gridSize) / 2, 1.0, 0.6);
        colors[index * 3] = color.r;
        colors[index * 3 + 1] = color.g;
        colors[index * 3 + 2] = color.b;
        */

        const color = new THREE.Color(1, 1, 1); // pure white

        colors[index * 3] = color.r;
        colors[index * 3 + 1] = color.g;
        colors[index * 3 + 2] = color.b;


        index++;
      }
    }

    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const positions = pointsRef.current.geometry.attributes.position.array;
    const time = state.clock.elapsedTime;

    // Create wave effect like birds flying
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = positions[i3];
      const z = positions[i3 + 2];

      // Multiple wave layers for organic movement
      const wave1 = Math.sin(x * 0.3 + time * 0.2) * 3;
      const wave2 = Math.cos(z * 0.3 + time * 0.5) * 3;
      const wave3 = Math.sin((x + z) * 0.2 + time * 0.2) * 2;
      const wave4 = Math.cos((x - z) * 0.15 + time * 0.2) * 2;

      // Combine waves for complex motion
      positions[i3 + 1] = wave1 + wave2 + wave3 + wave4;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Rotate entire system slowly
    pointsRef.current.rotation.y = time * 0.1;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        vertexColors
        transparent={false}
        sizeAttenuation={true}
      />
    </points>
  );
}

export default function ParticleWave() {
  return (
    <div className="fixed inset-0 z-0 bg-brand1">
      <Canvas camera={{ position: [0, 3, 40], fov: 75 }}>
        <ambientLight intensity={3} />
        <pointLight position={[0, 10, 10]} intensity={10} color="#ffffff" />
        <pointLight position={[0, -10, 10]} intensity={10} color="#ffffff" />
        <pointLight position={[10, 0, 10]} intensity={10} color="#ffffff" />

        <WaveParticles />
      </Canvas>
    </div>
  );
}
