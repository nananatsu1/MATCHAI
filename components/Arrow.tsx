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
  const lastRotationRef = useRef(rotation); // 前回のrotation値を保存
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
      model.scale.set(0.9, 0.9, 0.9);
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

    // 前回のrotation値と現在のrotation値を比較
    const lastRotation = lastRotationRef.current;
    
    // 角度の変化を検出（359度→0度の特殊なケースを処理）
    let delta = 0;
    
    // 時計回りの大きな変化を検出（例：359度→0度）
    if (lastRotation > 270 && rotation < 90) {
      delta = (rotation + 360) - lastRotation;
    } 
    // 反時計回りの大きな変化を検出（例：0度→359度）
    else if (rotation > 270 && lastRotation < 90) {
      delta = rotation - (lastRotation + 360);
    } 
    // 通常の変化
    else {
      delta = rotation - lastRotation;
    }
    
    // ラジアンに変換
    const deltaRad = delta * (Math.PI / 180);
    
    // 累積角度を更新
    setAngle(prevAngle => prevAngle + deltaRad);
    
    // カメラの位置を更新
    const camera = cameraRef.current;
    const newAngleRad = angle + deltaRad;
    camera.position.x = radius * Math.sin(newAngleRad);
    camera.position.z = radius * Math.cos(newAngleRad);
    camera.position.y = 1;
    camera.lookAt(0, 0, 0);
    
    // 今回のrotation値を保存
    lastRotationRef.current = rotation;
  }, [rotation]);

  return <canvas ref={canvasRef} className="border-black bg-gray-300"></canvas>;
};

export default Arrow;