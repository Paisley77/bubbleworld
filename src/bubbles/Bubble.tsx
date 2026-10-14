import {
    useRef,
    useState,
} from 'react'

import {
    useFrame,
} from '@react-three/fiber'

import type {
    Mesh,
    SphereGeometry,
} from 'three'

import {
    damp,
    floatingOffset,
    nextIndex,
} from '../bubbleMath'

import {
    BUBBLE_COLORS,
} from './bubbleData'

import type {
    BubbleModel,
} from './bubbleTypes'

interface BubbleProps {
    bubble: BubbleModel

    geometry: SphereGeometry
}

export function Bubble({
    bubble,
    geometry,
}: BubbleProps) {
    const meshRef =
        useRef<Mesh>(null)

    const [
        paletteIndex,
        setPaletteIndex,
    ] = useState(
        bubble.paletteIndex,
    )

    const [
        isPressed,
        setIsPressed,
    ] = useState(false)

    const [
        isHovered,
        setIsHovered,
    ] = useState(false)

    useFrame(
        (state, delta) => {
            const mesh =
                meshRef.current

            if (!mesh) {
                return
            }

            mesh.position.y =
                bubble.position[1] +
                floatingOffset(
                    state.clock.elapsedTime,
                    bubble.floatAmplitude,
                    bubble.floatSpeed,
                    bubble.floatPhase,
                )

            mesh.rotation.y +=
                bubble.spinSpeed * delta

            mesh.rotation.x +=
                0.08 * delta

            const pulse =
                isPressed
                    ? 1.22
                    : isHovered
                        ? 1.08
                        : 1

            const targetScale =
                bubble.radius * pulse

            const nextScale =
                damp(
                    mesh.scale.x,
                    targetScale,
                    12,
                    delta,
                )

            mesh.scale.setScalar(
                nextScale,
            )
        },
    )

    return (
        <mesh
            ref={meshRef}

            geometry={geometry}

            position={
                bubble.position
            }

            scale={[
                bubble.radius,
                bubble.radius,
                bubble.radius,
            ]}

            onPointerOver={
                (event) => {
                    event.stopPropagation()

                    setIsHovered(true)
                }
            }

            onPointerOut={() => {
                setIsHovered(false)

                setIsPressed(false)
            }}

            onPointerDown={
                (event) => {
                    event.stopPropagation()

                    setIsPressed(true)
                }
            }

            onPointerUp={
                (event) => {
                    event.stopPropagation()

                    setIsPressed(false)
                }
            }

            onClick={
                (event) => {
                    event.stopPropagation()

                    setPaletteIndex(
                        (current) =>
                            nextIndex(
                                current,
                                BUBBLE_COLORS.length,
                            ),
                    )
                }
            }
        >
            <meshPhysicalMaterial
                color={
                    BUBBLE_COLORS[
                    paletteIndex
                    ]
                }

                emissive={
                    BUBBLE_COLORS[
                    paletteIndex
                    ]
                }

                emissiveIntensity={
                    0.06
                }

                roughness={0.16}

                metalness={0.02}

                clearcoat={1}

                clearcoatRoughness={
                    0.08
                }

                transparent

                opacity={0.9}
            />
        </mesh>
    )
}