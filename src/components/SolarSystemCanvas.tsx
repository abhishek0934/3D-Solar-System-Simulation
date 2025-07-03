import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { planetsData } from '../data/planets';
import { PlanetState, SolarSystemControls, PlanetData } from '../types';
import { PlanetTooltip } from './PlanetTooltip';

interface SolarSystemCanvasProps {
  controls: SolarSystemControls;
}

export const SolarSystemCanvas: React.FC<SolarSystemCanvasProps> = ({ controls }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const clockRef = useRef<THREE.Clock>();
  const planetsRef = useRef<PlanetState[]>([]);
  const animationIdRef = useRef<number>();
  const raycasterRef = useRef<THREE.Raycaster>();
  const mouseRef = useRef<THREE.Vector2>();
  
  const [hoveredPlanet, setHoveredPlanet] = useState<PlanetData | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 20, 30);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Clock setup
    const clock = new THREE.Clock();
    clockRef.current = clock;

    // Raycaster setup
    raycasterRef.current = new THREE.Raycaster();
    mouseRef.current = new THREE.Vector2();

    // Create starfield
    const createStarfield = () => {
      const starsGeometry = new THREE.BufferGeometry();
      const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.5,
        transparent: true,
        opacity: 0.8
      });

      const starsVertices = [];
      for (let i = 0; i < 10000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starsVertices.push(x, y, z);
      }

      starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
      const stars = new THREE.Points(starsGeometry, starsMaterial);
      scene.add(stars);
    };

    // Create Sun
    const createSun = () => {
      const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
      const sunMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        emissive: 0xffff00,
        emissiveIntensity: 0.3
      });
      const sun = new THREE.Mesh(sunGeometry, sunMaterial);
      scene.add(sun);

      // Sun light
      const sunLight = new THREE.PointLight(0xffffff, 2, 100);
      sunLight.position.set(0, 0, 0);
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.width = 2048;
      sunLight.shadow.mapSize.height = 2048;
      scene.add(sunLight);

      // Ambient light
      const ambientLight = new THREE.AmbientLight(0x404040, 0.1);
      scene.add(ambientLight);
    };

    // Create planets
    const createPlanets = () => {
      planetsRef.current = planetsData.map((planetData) => {
        const geometry = new THREE.SphereGeometry(planetData.size, 32, 32);
        const material = new THREE.MeshPhongMaterial({
          color: planetData.color,
          shininess: 30
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.userData = { planetData };
        scene.add(mesh);

        // Create orbit line
        const orbitGeometry = new THREE.RingGeometry(
          planetData.distance - 0.02,
          planetData.distance + 0.02,
          64
        );
        const orbitMaterial = new THREE.MeshBasicMaterial({
          color: 0x444444,
          transparent: true,
          opacity: 0.1,
          side: THREE.DoubleSide
        });
        const orbitRing = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbitRing.rotation.x = -Math.PI / 2;
        scene.add(orbitRing);

        return {
          name: planetData.name,
          speed: planetData.baseSpeed,
          angle: Math.random() * Math.PI * 2,
          mesh
        };
      });
    };

    // Mouse move handler
    const handleMouseMove = (event: MouseEvent) => {
      if (!mountRef.current) return;
      
      const rect = mountRef.current.getBoundingClientRect();
      mouseRef.current!.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current!.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    // Handle window resize
    const handleResize = () => {
      if (!camera || !renderer) return;
      
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    // Animation loop
    const animate = () => {
      if (!controls.isPaused) {
        const deltaTime = clock.getDelta();
        
        // Update planet positions
        planetsRef.current.forEach((planet) => {
          const planetData = planetsData.find(p => p.name === planet.name);
          if (planetData && planet.mesh) {
            const speedMultiplier = controls.planetSpeeds[planet.name] || 1;
            planet.angle += planet.speed * speedMultiplier * deltaTime * 10;
            
            planet.mesh.position.x = Math.cos(planet.angle) * planetData.distance;
            planet.mesh.position.z = Math.sin(planet.angle) * planetData.distance;
            
            // Rotate planet on its axis
            planet.mesh.rotation.y += 0.01 * speedMultiplier;
          }
        });

        // Raycasting for hover detection
        if (raycasterRef.current && mouseRef.current && cameraRef.current) {
          raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
          const intersects = raycasterRef.current.intersectObjects(
            planetsRef.current.map(p => p.mesh).filter(Boolean) as THREE.Mesh[]
          );
          
          if (intersects.length > 0) {
            const hoveredMesh = intersects[0].object as THREE.Mesh;
            const planetData = hoveredMesh.userData.planetData;
            setHoveredPlanet(planetData);
          } else {
            setHoveredPlanet(null);
          }
        }
      }

      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
      
      animationIdRef.current = requestAnimationFrame(animate);
    };

    // Initialize scene
    createStarfield();
    createSun();
    createPlanets();

    // Add event listeners
    window.addEventListener('resize', handleResize);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);

    // Start animation
    animate();

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      window.removeEventListener('resize', handleResize);
      if (renderer) {
        renderer.domElement.removeEventListener('mousemove', handleMouseMove);
        mountRef.current?.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, []);

  // Update theme
  useEffect(() => {
    if (rendererRef.current && sceneRef.current) {
      const bgColor = controls.isDarkMode ? 0x000011 : 0x87CEEB;
      rendererRef.current.setClearColor(bgColor);
      sceneRef.current.background = new THREE.Color(bgColor);
    }
  }, [controls.isDarkMode]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div ref={mountRef} className="w-full h-full" />
      {hoveredPlanet && (
        <PlanetTooltip
          planet={hoveredPlanet}
          position={mousePosition}
          isDarkMode={controls.isDarkMode}
        />
      )}
    </div>
  );
};