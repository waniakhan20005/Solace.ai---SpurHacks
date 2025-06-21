"use client";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createNoise3D } from "simplex-noise";
import { useVapi } from "@/hooks/useVapi";
import ConversationCard from "./ConversationCard";

const Orb: React.FC = () => {
  const { audioLevel, isSpeechActive, toggleCall, messages, callStatus, start, stop } = useVapi();
  const [showTranscript, setShowTranscript] = useState<boolean>(false);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const ballRef = useRef<THREE.Mesh | null>(null);
  const originalPositionsRef = useRef<any | null>(null);
  const noise = createNoise3D();

  const isCallActive = callStatus === 'active';

  useEffect(() => {
    console.log("Initializing visualization...");
    initViz();
    window.addEventListener("resize", onWindowResize);
    return () => {
      window.removeEventListener("resize", onWindowResize);
    };
  }, []);

  useEffect(() => {
    if (isSpeechActive && ballRef.current) {
      console.log("Session is active, morphing the ball");
      updateBallMorph(ballRef.current, audioLevel);
    } else if (
      !isSpeechActive &&
      ballRef.current &&
      originalPositionsRef.current
    ) {
      console.log("Session ended, resetting the ball");
      resetBallMorph(ballRef.current, originalPositionsRef.current);
    }
  }, [audioLevel, isSpeechActive]);

  const initViz = () => {
    console.log("Initializing Three.js visualization...");
    const scene = new THREE.Scene();
    const group = new THREE.Group();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.5,
      100,
    );
    camera.position.set(0, 0, 100);
    camera.lookAt(scene.position);

    scene.add(camera);
    sceneRef.current = scene;
    groupRef.current = group;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current = renderer;

    const icosahedronGeometry = new THREE.IcosahedronGeometry(10, 8);
    const lambertMaterial = new THREE.MeshLambertMaterial({
      color: 0x898ac4,
      wireframe: true,
    });

    const ball = new THREE.Mesh(icosahedronGeometry, lambertMaterial);
    ball.position.set(0, 0, 0);
    ballRef.current = ball;

    // Store the original positions of the vertices
    originalPositionsRef.current =
      ball.geometry.attributes.position.array.slice();

    group.add(ball);

    const ambientLight = new THREE.AmbientLight(0x898ac4, 0.5);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0x898ac4);
    spotLight.intensity = 0.9;
    spotLight.position.set(-10, 40, 20);
    spotLight.lookAt(ball.position);
    spotLight.castShadow = true;
    scene.add(spotLight);

    scene.add(group);

    const outElement = document.getElementById("out");
    if (outElement) {
      outElement.innerHTML = ""; // Clear any existing renderer
      outElement.appendChild(renderer.domElement);
      renderer.setSize(outElement.clientWidth, outElement.clientHeight);
    }

    render();
  };

  const render = () => {
    if (
      !groupRef.current ||
      !ballRef.current ||
      !cameraRef.current ||
      !rendererRef.current ||
      !sceneRef.current
    ) {
      return;
    }

    groupRef.current.rotation.y += 0.005;
    rendererRef.current.render(sceneRef.current, cameraRef.current);
    requestAnimationFrame(render);
  };

  const onWindowResize = () => {
    if (!cameraRef.current || !rendererRef.current) return;

    const outElement = document.getElementById("out");
    if (outElement) {
      cameraRef.current.aspect =
        outElement.clientWidth / outElement.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(
        outElement.clientWidth,
        outElement.clientHeight,
      );
    }
  };

  const updateBallMorph = (mesh: THREE.Mesh, volume: number) => {
    console.log("Morphing the ball with volume:", volume);
    const geometry = mesh.geometry as THREE.BufferGeometry;
    const positionAttribute = geometry.getAttribute("position");

    for (let i = 0; i < positionAttribute.count; i++) {
      const vertex = new THREE.Vector3(
        positionAttribute.getX(i),
        positionAttribute.getY(i),
        positionAttribute.getZ(i),
      );

      const offset = 10; // Radius of the icosahedron
      const amp = 2.5; // Dramatic effect
      const time = window.performance.now();
      vertex.normalize();
      const rf = 0.00001;
      const distance =
        offset +
        volume * 4 + // Amplify volume effect
        noise(
          vertex.x + time * rf * 7,
          vertex.y + time * rf * 8,
          vertex.z + time * rf * 9,
        ) *
          amp *
          volume;
      vertex.multiplyScalar(distance);

      positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }

    positionAttribute.needsUpdate = true;
    geometry.computeVertexNormals();
  };

  const resetBallMorph = (
    mesh: THREE.Mesh,
    originalPositions: Float32Array,
  ) => {
    console.log("Resetting the ball to its original shape");
    const geometry = mesh.geometry as THREE.BufferGeometry;
    const positionAttribute = geometry.getAttribute("position");

    for (let i = 0; i < positionAttribute.count; i++) {
      positionAttribute.setXYZ(
        i,
        originalPositions[i * 3],
        originalPositions[i * 3 + 1],
        originalPositions[i * 3 + 2],
      );
    }

    positionAttribute.needsUpdate = true;
    geometry.computeVertexNormals();
  };

  return (
    <div className="h-full flex flex-col">
      {/* 3D Visualization & Buttons Container */}
      <div className="flex-1 relative">
        <div
          id="out"
          className="hover:cursor-pointer"
          onClick={toggleCall}
          style={{height: "100%", width: "100%"}}
        ></div>
        
        {/* Control Buttons */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex gap-3">
            {/* Start/Stop Talking Button */}
            <button
            onClick={isCallActive ? stop : start}
            className={`px-6 py-2 rounded-lg transition-colors shadow-lg ${
                isCallActive 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
            >
            {isCallActive ? '🔴 Stop Talking' : '🎤 Start Talking'}
            </button>
            
            {/* Show Transcript Button */}
            {messages.length > 0 && (
            <button
                onClick={() => setShowTranscript(!showTranscript)}
                className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
            >
                {showTranscript ? '📋 Hide Transcript' : '📋 Show Final Transcript'}
            </button>
            )}
        </div>
      </div>

      {/* Transcript Display */}
      {showTranscript && messages.length > 0 && (
        <div className="flex-shrink-0 p-4 bg-gray-50 border-t">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 Final Transcript</h3>
          <ConversationCard 
            messages={messages} 
            activeTranscript={null}
          />
        </div>
      )}
    </div>
  );
};

export default Orb;
