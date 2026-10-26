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
    nextIndex,
} from '../bubbleMath'

import type {
    BubbleBody,
} from '../physics/physicsTypes'

import {
    BUBBLE_COLORS,
} from './bubbleData'

interface NumberRef {
    current: number
}

interface BubbleProps {
    body: BubbleBody
    geometry: SphereGeometry
    interpolationAlpha: NumberRef
}

export function Bubble({
    body,
    geometry,
    interpolationAlpha,
}: BubbleProps) {
    const meshRef =
        useRef<Mesh>(null!)

    const [
        paletteIndex,
        setPaletteIndex,
    ] = useState(
        body.model.paletteIndex,
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
        (_, delta) => {
            const mesh = meshRef.current

            if (!mesh) {
                return
            }

            mesh.position.lerpVectors(
                body.previousPosition,
                body.position,
                interpolationAlpha.current,
            )

            mesh.rotation.y +=
                body.model.spinSpeed * delta

            mesh.rotation.x +=
                0.08 * delta

            const pulse =
                isPressed
                    ? 1.22
                    : isHovered
                        ? 1.08
                        : 1

            const targetScale =
                body.model.radius * pulse

            const nextScale = damp(
                mesh.scale.x,
                targetScale,
                12,
                delta,
            )

            mesh.scale.setScalar(
                nextScale,
            )
        },
        -1,
    )

    return (
        <mesh
            ref={meshRef}
            geometry={geometry}
            position={
                body.model.initialPosition
            }
            scale={[
                body.model.radius,
                body.model.radius,
                body.model.radius,
            ]}
            onPointerOver={(event) => {
                event.stopPropagation()
                setIsHovered(true)
            }}
            onPointerOut={() => {
                setIsHovered(false)
                setIsPressed(false)
            }}
            onPointerDown={(event) => {
                event.stopPropagation()
                setIsPressed(true)
            }}
            onPointerUp={(event) => {
                event.stopPropagation()
                setIsPressed(false)
            }}
            onClick={(event) => {
                event.stopPropagation()

                setPaletteIndex(
                    (current) =>
                        nextIndex(
                            current,
                            BUBBLE_COLORS.length,
                        ),
                )
            }}
        >
            <meshPhysicalMaterial
                color={
                    BUBBLE_COLORS[paletteIndex]
                }
                emissive={
                    BUBBLE_COLORS[paletteIndex]
                }
                emissiveIntensity={0.06}
                roughness={0.16}
                metalness={0.02}
                clearcoat={1}
                clearcoatRoughness={0.08}
                transparent
                opacity={0.9}
            />
        </mesh>
    )
}