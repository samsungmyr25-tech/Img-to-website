import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface ThreeJsBackgroundProps {
  intensity?: number;
}

export default function ThreeJsBackground({ intensity = 1.0 }: ThreeJsBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Create Scene
    const scene = new THREE.Scene();

    // 2. Setup Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 80;

    // 3. Setup Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 4. Create Particles (Artistic Galaxy)
    const particleCount = 280;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const accentColor1 = new THREE.Color("#D4FF00"); // Signature Imager Lime
    const accentColor2 = new THREE.Color("#00F0FF"); // Futuristic Cyan
    const highlightColor = new THREE.Color("#FF007A"); // Cyberpunk Pink / Red

    for (let i = 0; i < particleCount; i++) {
      // Disk-like distribution for galaxies
      const angle = Math.random() * Math.PI * 2;
      const radius = 5 + Math.random() * 85;
      const y = (Math.random() - 0.5) * 20;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      // Color mapping
      let mixedColor = accentColor1.clone();
      const choice = Math.random();
      if (choice < 0.4) {
        mixedColor.lerp(accentColor2, Math.random());
      } else if (choice < 0.7) {
        mixedColor.lerp(highlightColor, Math.random());
      } else {
        mixedColor = new THREE.Color("#FFFFFF").lerp(accentColor1, Math.random());
      }

      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;

      sizes[i] = 1.0 + Math.random() * 2.5;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Particle Texture (draw simple neat canvas glowing dots)
    const createCircleTexture = () => {
      const size = 16;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.8)");
        gradient.addColorStop(0.6, "rgba(255, 255, 255, 0.2)");
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const material = new THREE.PointsMaterial({
      size: 4.5,
      map: createCircleTexture(),
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    // 5. Add lines connection between close particles for a cyber-mesh constellation feel
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.04,
      blending: THREE.AdditiveBlending,
    });

    const maxConnections = 120;
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(maxConnections * 2 * 3);
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // Let's keep a gentle celestial glow
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
    scene.add(ambientLight);

    // Mouse Move listeners
    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      mouseRef.current.targetX = (x / rect.width) * 2 - 1;
      mouseRef.current.targetY = -(y / rect.height) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Watch resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);
    const ob = new ResizeObserver(handleResize);
    ob.observe(container);

    // Animation Loop
    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Lazy mouse inertia
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Slow orbital rotate
      particleSystem.rotation.y = time * 0.02 * intensity;
      particleSystem.rotation.x = time * 0.005 * intensity;

      // Slightly affect rotation based on cursor
      particleSystem.rotation.y += mouseRef.current.x * 0.12;
      particleSystem.rotation.x -= mouseRef.current.y * 0.12;

      // Render line connections on the fly for active constellation grid lines
      const posArr = geometry.attributes.position.array as Float32Array;
      const lPosArr = lines.geometry.attributes.position.array as Float32Array;
      
      let lineIndex = 0;
      let connectionCount = 0;

      // Scan first 80 particles for near proximity connectivity lines
      const scanLimit = Math.min(particleCount, 80);
      for (let i = 0; i < scanLimit; i++) {
        for (let j = i + 1; j < scanLimit; j++) {
          if (connectionCount >= maxConnections) break;

          const dx = posArr[i * 3] - posArr[j * 3];
          const dy = posArr[i * 3 + 1] - posArr[j * 3 + 1];
          const dz = posArr[i * 3 + 2] - posArr[j * 3 + 2];
          const distSq = dx * dx + dy * dy + dz * dz;

          // If within distance threshold, link them!
          if (distSq < 150) { 
            lPosArr[lineIndex * 6] = posArr[i * 3];
            lPosArr[lineIndex * 6 + 1] = posArr[i * 3 + 1];
            lPosArr[lineIndex * 6 + 2] = posArr[i * 3 + 2];

            lPosArr[lineIndex * 6 + 3] = posArr[j * 3];
            lPosArr[lineIndex * 6 + 4] = posArr[j * 3 + 1];
            lPosArr[lineIndex * 6 + 5] = posArr[j * 3 + 2];

            lineIndex++;
            connectionCount++;
          }
        }
      }

      // Fill remaining lines with zeroes
      for (let i = connectionCount; i < maxConnections; i++) {
        lPosArr[i * 6] = 0;
        lPosArr[i * 6 + 1] = 0;
        lPosArr[i * 6 + 2] = 0;
        lPosArr[i * 6 + 3] = 0;
        lPosArr[i * 6 + 4] = 0;
        lPosArr[i * 6 + 5] = 0;
      }

      lines.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup resources to prevent WebGL context leaks on hot-reload/navigation!
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      ob.disconnect();

      // DisposeThree
      geometry.dispose();
      material.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [intensity]);

  return (
    <div 
      id="three_js_canvas_wrapper" 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden opacity-50 select-none bg-radial from-transparent to-[#0F0F0F]/65"
    />
  );
}
