import {
  Canvas,
} from '@react-three/fiber'

import {
  BubbleField,
} from './bubbles/BubbleField'

import './App.css'

const BUBBLE_COUNT = 28

const WORLD_SEED =
  20261013

function Scene() {
  return (
    <Canvas
      camera={{
        position: [
          0,
          0,
          8.5,
        ],

        fov: 50,
      }}

      dpr={[
        1,
        1.5,
      ]}
    >
      <fog
        attach="fog"

        args={[
          '#07111f',
          7.5,
          13,
        ]}
      />

      <ambientLight
        intensity={1.15}
      />

      <directionalLight
        position={[
          4,
          5,
          6,
        ]}

        intensity={3.1}
      />

      <directionalLight
        position={[
          -4,
          -2,
          3,
        ]}

        intensity={1.15}
      />

      <BubbleField
        count={
          BUBBLE_COUNT
        }

        seed={
          WORLD_SEED
        }
      />
    </Canvas>
  )
}

export default function App() {
  return (
    <main
      className="app-shell"
    >
      <section
        className="intro-panel"
      >
        <p
          className="eyebrow"
        >
          BUBBLEWORLD · MODULE 04
        </p>

        <h1>
          The bubbles can collide.
        </h1>

        <p
          className="lede"
        >
          Every bubble is now a physical sphere.
          Overlapping bubbles are separated and
          exchange momentum using mass-aware
          collision impulses.
        </p>

        <p
          className="hint"
        >
          Watch moving bubbles strike one another,
          scatter, rebound, and push clusters
          around the simulated world.
        </p>
      </section>

      <section
        className="world-panel"

        aria-label=
        "Interactive 3D BubbleWorld physics scene"
      >
        <Scene />
      </section>
    </main>
  )
}