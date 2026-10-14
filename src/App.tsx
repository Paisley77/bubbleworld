import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import { floatingOffset, nextIndex } from './bubbleMath'
import './App.css'

const BUBBLE_COLORS = [
  '#7dd3fc',
  '#c4b5fd',
  '#f9a8d4',
  '#86efac',
  '#fde68a',
]

function Bubble() {
  const meshRef = useRef<Mesh>(null!)
  const [colorIndex, setColorIndex] = useState(0)
  const [isPressed, setIsPressed] = useState(false)

  useFrame((state, delta) => {
    const bubble = meshRef.current
    bubble.position.y = floatingOffset(state.clock.elapsedTime)
    bubble.rotation.y += delta * 0.28
    bubble.rotation.x += delta * 0.12
    const targetScale = isPressed ? 1.2 : 1
    bubble.scale.x += (targetScale - bubble.scale.x) * 0.12
    bubble.scale.y += (targetScale - bubble.scale.y) * 0.12
    bubble.scale.z += (targetScale - bubble.scale.z) * 0.12
  })

  return (
    <mesh
      ref={meshRef}
      onPointerDown={(event) => {
        event.stopPropagation()
        setIsPressed(true)
      }}
      onPointerUp={(event) => {
        event.stopPropagation()
        setIsPressed(false)
      }}
      onPointerOut={() => setIsPressed(false)}
      onClick={(event) => {
        event.stopPropagation()
        setColorIndex((current) => nextIndex(current, BUBBLE_COLORS.length))
      }}
    >
      <sphereGeometry args={[1, 64, 64]} />
      <meshPhysicalMaterial
        color={BUBBLE_COLORS[colorIndex]}
        roughness={0.12}
        metalness={0.05}
        transmission={0.18}
        transparent
        opacity={0.9}
        clearcoat={1}
        clearcoatRoughness={0.08}
      />
    </mesh >
  )
}

function Scene() {
  return (
    <Canvas
      camera={{
        position: [0, 0, 4.5],
        fov: 45
      }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={1.3} />
      <directionalLight
        position={[3, 4, 5]}
        intensity={3.2}
      />
      <directionalLight
        position={[-4, -2, -2]}
        intensity={1.1}
      />

      <Bubble />
    </Canvas>
  )
}

export default function App() {
  return (
    <main className="app-shell">
      <section className="intro-panel">
        <p className="eyebrow">
          BUBBLEWORLD · MODULE 01
        </p>
        <h1>
          The first living bubble.
        </h1>
        <p className="lede">
          This is a real 3D object. It is lit by virtual lights, rendered by GPU, animated every frame, and responds to the pointer.
        </p>
        <p className="hint">
          Click or tap the bubble to make it pulse and change color.
        </p>
      </section>
      <section
        className="world-panel"
        aria-label="Interactive 3D BubbleWorld scene"
      >
        <Scene />
      </section>
    </main>
  )
}