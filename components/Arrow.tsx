"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

interface ArrowProps {
  rotation: number; // rotationをpropsとして受け取る
}

const Arrow: React.FC<ArrowProps> = ({ rotation }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [angle, setAngle] = useState(0);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const radius = Math.sqrt(5);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    const sizes = {
      width: window.innerWidth * 0.8,
      height: window.innerWidth * 0.8,
    };

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      1000
    );
    camera.position.set(0, 1, 2);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    scene.add(directionalLight);

    // Load 3D model
    const gltfLoader = new GLTFLoader();
    gltfLoader.load("./models/arrow.gltf", (gltf) => {
      const model = gltf.scene;
      model.scale.set(1, 1, 1);
      model.rotation.y = Math.PI / 2;
      model.position.set(-0.1, 0, 0.3);
      scene.add(model);
      modelRef.current = model;
    });

    // Axes Helper
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    const animate = () => {
      if (renderer && camera && scene) {
        renderer.render(scene, camera);
      }
      requestAnimationFrame(animate);
    };
    animate();
  }, []); // 初期化は一度だけ実行

  useEffect(() => {
    if (!cameraRef.current) return;

    // 変化量を計算
    let delta = (rotation - angle * (180 / Math.PI) + 360) % 360;
    if (delta > 180) delta -= 360; // 逆回転を防ぐ

    // 累積角度を更新
    const newAngle = angle + delta * (Math.PI / 180);
    setAngle(newAngle);

    const camera = cameraRef.current;
    camera.position.x = radius * Math.sin(newAngle);
    camera.position.z = radius * Math.cos(newAngle);
    camera.position.y = 1;
    camera.lookAt(0, 0, 0);
  }, [rotation]);

  return <canvas ref={canvasRef} className="border-black bg-gray-300"></canvas>;
};

export default Arrow;
