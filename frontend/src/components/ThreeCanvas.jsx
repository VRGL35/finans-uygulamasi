import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 3000);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    if (renderer.domElement) {
      renderer.domElement.style.position = "absolute";
      renderer.domElement.style.top = "0";
      renderer.domElement.style.left = "0";
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      currentMount.appendChild(renderer.domElement);
    }

    const starCount = 6000; 
    const posArray = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 3000;     
      posArray[i + 1] = (Math.random() - 0.5) * 3000; 
      posArray[i + 2] = -Math.random() * 3000;        
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 1.2,
      color: 0xffffff,
      transparent: true,
      opacity: 0.8
    });

    const starField = new THREE.Points(starGeo, starMaterial);
    scene.add(starField);

    let warpSpeed = 0;
    let normalSpeed = 0.5;
    let targetWarpSpeed = 0;
    let animationFrameId;
    let warpTimeout;
    let clickTimeout;

    const animate = () => {
      warpSpeed += (targetWarpSpeed - warpSpeed) * 0.1;

      const positions = starGeo.attributes.position.array;
      for (let i = 0; i < starCount * 3; i += 3) {
        positions[i + 2] += normalSpeed + warpSpeed;

        if (positions[i + 2] > 100) {
          positions[i] = (Math.random() - 0.5) * 3000;       
          positions[i + 1] = (Math.random() - 0.5) * 3000;   
          positions[i + 2] = -2000 - Math.random() * 1000;   
        }
      }
      
      starGeo.attributes.position.needsUpdate = true;
      
      starField.rotation.z -= 0.0002;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    const handleScroll = () => {
      targetWarpSpeed = 20; 
      clearTimeout(warpTimeout);
      warpTimeout = setTimeout(() => {
        targetWarpSpeed = 0;
      }, 150);
    };

    const handleClick = () => {
      targetWarpSpeed = 35; 
      clearTimeout(clickTimeout);
      clickTimeout = setTimeout(() => {
        targetWarpSpeed = 0;
      }, 300);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("click", handleClick);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("click", handleClick);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      starGeo.dispose();
      starMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        pointerEvents: "none",
        background: "radial-gradient(circle at 50% 50%, var(--bg-card) 0%, var(--bg-scene) 100%)",
        transition: "background 0.5s ease"
      }}
    />
  );
}