import {
  Canvas,
} from '@react-three/fiber'

import {
  BubbleField,
} from './bubbles/BubbleField'

import './App.css'

const BUBBLE_COUNT = 80

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
          BUBBLEWORLD · MODULE 02
        </p>

        <h1>
          One system. Many bubbles.
        </h1>

        <p
          className="lede"
        >
          The scene is now generated from
          data instead of hand-written
          objects. Every bubble has its own
          identity, position, size, motion,
          and color while sharing the same
          rendering machinery.
        </p>

        <p
          className="hint"
        >
          {BUBBLE_COUNT} deterministic
          bubbles · hover or press to
          pulse · click or tap to cycle
          color
        </p>
      </section>

      <section
        className="world-panel"

        aria-label=
        "Interactive 3D BubbleWorld scene"
      >
        <Scene />
      </section>
    </main>
  )
}