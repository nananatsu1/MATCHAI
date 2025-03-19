"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

interface ArrowProps {
  rotation: number; // rotationをpropsとして受け取る
}

const Arrow: React.FC<ArrowProps> = ({ rotation }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [angle, setAngle] = useState(0); // angleをstateとして管理
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const radius = Math.sqrt(5);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    const sizes = {
      width: window.innerWidth / 2,
      height: window.innerHeight / 2,
    };

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
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

    // 現在の角度と新しい角度の差を計算
    const currentAngle = angle;
    const newAngle = rotation * (Math.PI / 180);
    let deltaAngle = newAngle - currentAngle;

    // 最短の回転方向を選択
    if (deltaAngle > Math.PI) {
      deltaAngle -= 2 * Math.PI;
    } else if (deltaAngle < -Math.PI) {
      deltaAngle += 2 * Math.PI;
    }

    const updatedAngle = currentAngle + deltaAngle;
    setAngle(updatedAngle);

    const camera = cameraRef.current;
    camera.position.x = radius * Math.sin(updatedAngle);
    camera.position.z = radius * Math.cos(updatedAngle);
    camera.position.y = 1;
    camera.lookAt(0, 0, 0);
  }, [rotation]); // rotationが更新されるたびにカメラを更新

  return <canvas ref={canvasRef} className="border-black bg-gray-300"></canvas>;
};

export default Arrow;
