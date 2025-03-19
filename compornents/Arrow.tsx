"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import Compass from "./Compass"; // Compassコンポーネントをインポート

const Arrow = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [angle, setAngle] = useState(0); // angleをstateとして管理
  const { rotation } = Compass(); // Compassからrotationを取得
  let model: THREE.Group;
  let radius = Math.sqrt(5);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    const sizes = {
      width: window.innerWidth / 3,
      height: window.innerHeight / 3,
    };

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
    camera.position.set(0, 1, 2);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    scene.add(directionalLight);

    // Load 3D model
    const gltfLoader = new GLTFLoader();
    gltfLoader.load("./models/arrow.gltf", (gltf) => {
      model = gltf.scene;
      model.scale.set(1, 1, 1);
      model.rotation.y = Math.PI / 2;
      model.position.set(-0.1, 0, 0.3);
      scene.add(model);
    });

    // Axes Helper
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    const tick = () => {
      // angleをrotationに基づいて更新
      setAngle(rotation * (Math.PI / 180)); // rotationをラジアンに変換
      camera.position.x = radius * Math.sin(angle);
      camera.position.z = radius * Math.cos(angle);
      camera.position.y = 1;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    };
    tick();
  }, [rotation, angle]); // rotationが更新されるたびに再レンダリング

  return (
      <canvas ref={canvasRef} className="border-black bg-gray-300"></canvas>
  );
};

export default Arrow;
