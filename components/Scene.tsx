'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Create circular texture for particles
function createCircleTexture() {
  if (typeof document === 'undefined') {
    return null;
  }
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Combined marine particles - marine snow and rising bubbles
function MarineParticles() {
  const snowRef = useRef<THREE.Points>(null);
  const bubbleRef = useRef<THREE.Points>(null);
  
  const snowCount = 1275;
  const bubbleCount = 600;

  // Create circular texture once
  const circleTexture = useMemo(() => {
    const tex = createCircleTexture();
    return tex ?? undefined;
  }, []);

  // Marine snow - suspended particles drifting slowly
  const { snowPositions, snowVelocities } = useMemo(() => {
    const pos = new Float32Array(snowCount * 3);
    const vel = new Float32Array(snowCount * 3);

    for (let i = 0; i < snowCount; i++) {
      // Spread across scene with depth
      pos[i * 3] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30 - 5;

      // Very slow drift velocities - reduced by 25%
      vel[i * 3] = (Math.random() - 0.5) * 0.0015;
      vel[i * 3 + 1] = -(Math.random() * 0.00375 + 0.0015); // Slight downward drift
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.0015;
    }

    return { snowPositions: pos, snowVelocities: vel };
  }, []);

  // Bubbles - rising from bottom
  const { bubblePositions, bubbleVelocities, bubblePhases } = useMemo(() => {
    const pos = new Float32Array(bubbleCount * 3);
    const vel = new Float32Array(bubbleCount * 3);
    const phases = new Float32Array(bubbleCount);

    for (let i = 0; i < bubbleCount; i++) {
      // Start from bottom area
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = -15 + Math.random() * 5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;

      // Slow upward velocity with more wobble
      vel[i * 3] = (Math.random() - 0.5) * 0.002;
      vel[i * 3 + 1] = 0.003 + Math.random() * 0.004;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.002;

      phases[i] = Math.random() * Math.PI * 2;
    }

    return { bubblePositions: pos, bubbleVelocities: vel, bubblePhases: phases };
  }, []);

  useFrame((state) => {
    // Update snow
    if (snowRef.current) {
      const positionArray = snowRef.current.geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < snowCount; i++) {
        positionArray[i * 3] += snowVelocities[i * 3];
        positionArray[i * 3 + 1] += snowVelocities[i * 3 + 1];
        positionArray[i * 3 + 2] += snowVelocities[i * 3 + 2];

        // Wrap around when going too low
        if (positionArray[i * 3 + 1] < -15) {
          positionArray[i * 3 + 1] = 15;
          positionArray[i * 3] = (Math.random() - 0.5) * 50;
          positionArray[i * 3 + 2] = (Math.random() - 0.5) * 30 - 5;
        }
      }

      snowRef.current.geometry.attributes.position.needsUpdate = true;
    }

      // Update bubbles
    if (bubbleRef.current) {
      const positionArray = bubbleRef.current.geometry.attributes.position.array as Float32Array;
      const time = state.clock.elapsedTime;

      for (let i = 0; i < bubbleCount; i++) {
        // Slow upward motion with more wobble
        positionArray[i * 3] += bubbleVelocities[i * 3] + Math.sin(time * 0.8 + bubblePhases[i]) * 0.003;
        positionArray[i * 3 + 1] += bubbleVelocities[i * 3 + 1];
        positionArray[i * 3 + 2] += bubbleVelocities[i * 3 + 2] + Math.cos(time * 0.8 + bubblePhases[i]) * 0.003;

        // Reset to bottom when reaching top
        if (positionArray[i * 3 + 1] > 12) {
          positionArray[i * 3 + 1] = -15;
          positionArray[i * 3] = (Math.random() - 0.5) * 40;
          positionArray[i * 3 + 2] = (Math.random() - 0.5) * 30;
        }
      }

      bubbleRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const snowGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(snowPositions, 3));
    return geo;
  }, [snowPositions]);

  const bubbleGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(bubblePositions, 3));
    return geo;
  }, [bubblePositions]);

  return (
    <>
      {/* Marine snow - small, subtle particles */}
      <points ref={snowRef} geometry={snowGeometry}>
        <pointsMaterial
          map={circleTexture}
          size={0.1}
          color="#4A8A9A"
          transparent
          opacity={0.5}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {/* Bubbles - slightly larger, luminous */}
      <points ref={bubbleRef} geometry={bubbleGeometry}>
        <pointsMaterial
          map={circleTexture}
          size={0.11}
          color="#8FC4D4"
          transparent
          opacity={0.55}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
}

// Subsea fiber optic cable with data pulse and trail
function FiberCable() {
  const cableRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const { mouse, viewport } = useThree();
  
  // Create realistic cable curve - low profile across seabed, extending far beyond viewport
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-60, -4, -20),
      new THREE.Vector3(-40, -3.5, -12),
      new THREE.Vector3(-20, -4.2, -6),
      new THREE.Vector3(-10, -4.2, -3),
      new THREE.Vector3(-4, -4.2, -2),
      new THREE.Vector3(0, -3.8, 0),
      new THREE.Vector3(4, -4.0, 2),
      new THREE.Vector3(10, -3.5, 4),
      new THREE.Vector3(20, -3.5, 7),
      new THREE.Vector3(40, -3.5, 12),
      new THREE.Vector3(60, -4, 20),
    ], false, 'catmullrom', 0.5);
  }, []);

  useFrame((state) => {
    if (cableRef.current) {
      // Very subtle parallax following mouse
      const targetX = (mouse.x * viewport.width) / 50;
      const targetY = (mouse.y * viewport.height) / 50;
      
      cableRef.current.rotation.y = THREE.MathUtils.lerp(
        cableRef.current.rotation.y,
        targetX * 0.02,
        0.02
      );
      cableRef.current.rotation.x = THREE.MathUtils.lerp(
        cableRef.current.rotation.x,
        -targetY * 0.02,
        0.02
      );
    }
    
    // Animate pulse traveling through cable - fast speed
    const pulseProgress = (state.clock.elapsedTime * 0.5) % 1;
    const point = curve.getPoint(pulseProgress);
    const tangent = curve.getTangent(pulseProgress);
    const lookTarget = point.clone().add(tangent);
    
    // Update main pulse mesh
    if (pulseRef.current) {
      pulseRef.current.position.copy(point);
      pulseRef.current.lookAt(lookTarget);
    }
    
    // Update trail mesh - follows the pulse with a slight offset
    if (trailRef.current) {
      // Calculate trail position slightly behind pulse
      const trailProgress = Math.max(0, pulseProgress - 0.04);
      const trailPoint = curve.getPoint(trailProgress);
      const trailTangent = curve.getTangent(trailProgress);
      
      trailRef.current.position.copy(trailPoint);
      trailRef.current.lookAt(trailPoint.clone().add(trailTangent));
      
      // Fade trail based on distance from pulse
      const material = trailRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = Math.max(0, 1 - (pulseProgress - trailProgress) * 50) * 0.6;
    }
    
    // Update light that follows pulse - hide light near cable ends
    if (lightRef.current) {
      lightRef.current.position.copy(point);
      lightRef.current.position.y += 0.3;
      // Hide light when near cable ends (first/last 15% of curve)
const isNearEnd = pulseProgress < 0.15 || pulseProgress > 0.85;
    lightRef.current.intensity = isNearEnd ? 0 : 1.5;
    }
  });

  return (
    <group>
      {/* Main cable - thin and realistic */}
      <mesh ref={cableRef}>
        <tubeGeometry args={[curve, 128, 0.12, 8, false]} />
<meshStandardMaterial
  color="#0A1628"
  roughness={0.9}
  metalness={0.1}
  emissive="#001122"
  emissiveIntensity={0.1}
/>
      </mesh>
      
      {/* Glowing core of cable */}
      <mesh ref={cableRef}>
        <tubeGeometry args={[curve, 128, 0.06, 6, false]} />
<meshBasicMaterial
  color="#00F0FF"
  transparent
  opacity={0.3}
/>
      </mesh>
      
      {/* Fading trail following the pulse */}
      <mesh ref={trailRef}>
        <tubeGeometry args={[curve, 100, 0.12, 6, false]} />
        <meshBasicMaterial
          color="#00F0FF"
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Bright leading pulse - matches wire shape */}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.09, 8, 8]} />
        <meshBasicMaterial
          color="#CCFFFF"
          transparent
          opacity={1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
{/* Dynamic light following the pulse */}
  <pointLight
    ref={lightRef}
    intensity={20}
    distance={15}
    color="#00F0FF"
    position={[0, 0, 0]}
  />
    </group>
  );
}

// Faint seabed contour lines
function SeabedContour() {
  const linesRef = useRef<THREE.Group>(null);

  const lineGroup = useMemo(() => {
    const group = new THREE.Group();
    for (let i = 0; i < 8; i++) {
      const points = [];
      const z = -6 - i * 0.8;
      const amplitude = 0.5 + i * 0.1;
      
      for (let x = -20; x <= 20; x += 0.5) {
        const y = -5 + Math.sin(x * 0.3 + i) * amplitude * 0.3;
        points.push(new THREE.Vector3(x, y, z));
      }
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: "#1A3A4A",
        transparent: true,
        opacity: 0.15 - i * 0.015,
        blending: THREE.AdditiveBlending,
      });
      const line = new THREE.Line(geometry, material);
      group.add(line);
    }
    return group;
  }, []);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.05) * 0.02;
    }
  });

  return <primitive ref={linesRef} object={lineGroup} />;
}

// Mouse-controlled point light
function MouseLight() {
  const lightRef = useRef<THREE.PointLight>(null);
  const { viewport, size } = useThree();
  
  useFrame((state) => {
    if (lightRef.current) {
      // Convert normalized mouse (-1 to 1) to pixel coordinates, then to world
      const x = (state.mouse.x * 0.5 + 0.5) * size.width;
      const y = (state.mouse.y * 0.5 + 0.5) * size.height;
      
      // Convert window coords to normalized device coordinates (-1 to +1)
      const ndcX = (x / size.width) * 2 - 1;
      const ndcY = -(y / size.height) * 2 + 1;
      
      // Unproject to get world position
      const vector = new THREE.Vector3(ndcX, ndcY, 0.5);
      vector.unproject(state.camera);
      
      // Calculate position on z=8 plane
      const dir = vector.sub(state.camera.position).normalize();
      const distance = (8 - state.camera.position.z) / dir.z;
      const pos = state.camera.position.clone().add(dir.multiplyScalar(distance));
      
      lightRef.current.position.copy(pos);
    }
  });

  return (
<pointLight
  ref={lightRef}
  position={[0, 0, 8]}
  intensity={80}
  color="#00F0FF"
  distance={60}
  decay={2}
/>
  );
}

// Sonar scan line overlay effect
function SonarOverlay() {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
      const material = ref.current.material as THREE.MeshBasicMaterial;
      // Slow scan line moving down
      const scanProgress = (state.clock.elapsedTime * 0.15) % 1;
      material.opacity = Math.sin(scanProgress * Math.PI) * 0.08;
      
      // Position scan line
      ref.current.position.y = 10 - scanProgress * 25;
    }
  });

  return (
    <mesh ref={ref} position={[0, 10, 2]} rotation={[0, 0, 0]}>
      <planeGeometry args={[50, 0.1]} />
      <meshBasicMaterial
        color="#00F0FF"
        transparent
        opacity={0.08}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

// Data particles floating upward
function DataParticles() {
  const ref = useRef<THREE.Points>(null);
  const count = 50;
  
  const { positions, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const ph = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = -10 + Math.random() * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      ph[i] = Math.random() * Math.PI * 2;
    }
    
    return { positions: pos, phases: ph };
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  useFrame((state) => {
    if (ref.current) {
      const positionArray = ref.current.geometry.attributes.position.array as Float32Array;
      const time = state.clock.elapsedTime * 0.5;
      
      for (let i = 0; i < count; i++) {
        // Float upward slowly
        positionArray[i * 3 + 1] += 0.01;
        
        // Wiggle motion
        positionArray[i * 3] += Math.sin(time + phases[i]) * 0.002;
        positionArray[i * 3 + 2] += Math.cos(time + phases[i]) * 0.002;
        
        // Reset when too high
        if (positionArray[i * 3 + 1] > 10) {
          positionArray[i * 3 + 1] = -10;
          positionArray[i * 3] = (Math.random() - 0.5) * 30;
        }
      }
      
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.05}
        color="#00F0FF"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Main scene component
function SceneContent() {
  return (
    <>
{/* Deep ocean fog - exponential for smooth falloff */}
  <fogExp2 attach="fog" args={['#020617', 0.025]} />
      
{/* Ambient light - base visibility */}
  <ambientLight intensity={0.3} color="#0A1A2A" />
      
{/* Fixed lights from top-left and bottom-right illuminating cable */}
  <pointLight
    position={[-30, 15, 8]}
    intensity={120}
    color="#00F0FF"
    distance={100}
    decay={1}
  />
  <pointLight
    position={[30, -10, 8]}
    intensity={120}
    color="#00F0FF"
    distance={100}
    decay={1}
  />
  {/* Light following mouse cursor */}
  <MouseLight />
{/* Subtle rim light from below */}
<pointLight
  position={[0, -10, -5]}
  intensity={0.6}
  color="#004466"
  distance={25}
/>
      
      {/* Scene elements */}
      <MarineParticles />
      <SeabedContour />
      <FiberCable />
      <DataParticles />
      <SonarOverlay />
    </>
  );
}

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 2, 12], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      style={{
        background: 'radial-gradient(ellipse at center, #0A1A2A 0%, #020617 50%, #010510 100%)',
      }}
    >
      <SceneContent />
    </Canvas>
  );
}
