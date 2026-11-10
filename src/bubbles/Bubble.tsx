import {
    useMemo,
    useRef,
    useState,
} from 'react'

import {
    useFrame,
    useThree,
    type ThreeEvent,
} from '@react-three/fiber'

import {
    Plane,
    Vector3,
    type Mesh,
    type SphereGeometry,
} from 'three'

import {
    damp,
    nextIndex,
} from '../bubbleMath'

import {
    clampBodyPositionToBounds,
} from '../physics/bubblePhysics'

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

const MAX_THROW_SPEED = 3.2

const DRAG_VELOCITY_BLEND = 0.35

const RELEASE_IDLE_THRESHOLD_MS = 90

export function Bubble({
    body,
    geometry,
    interpolationAlpha,
}: BubbleProps) {
    const meshRef =
        useRef<Mesh>(null!)

    const camera =
        useThree(
            (state) =>
                state.camera,
        )

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

    const dragPlane =
        useMemo(
            () => new Plane(),
            [],
        )

    const planeNormal =
        useMemo(
            () => new Vector3(),
            [],
        )

    const dragIntersection =
        useMemo(
            () => new Vector3(),
            [],
        )

    const grabOffset =
        useMemo(
            () => new Vector3(),
            [],
        )

    const dragTarget =
        useMemo(
            () => new Vector3(),
            [],
        )

    const lastDragPosition =
        useMemo(
            () => new Vector3(),
            [],
        )

    const sampledVelocity =
        useMemo(
            () => new Vector3(),
            [],
        )

    const dragPointerId =
        useRef<number | null>(
            null,
        )

    const lastDragTime =
        useRef(0)

    function beginDrag(
        event:
            ThreeEvent<PointerEvent>,
    ): void {
        event.stopPropagation()

        if (
            dragPointerId.current !==
            null
        ) {
            return
        }

        camera.getWorldDirection(
            planeNormal,
        )

        dragPlane
            .setFromNormalAndCoplanarPoint(
                planeNormal,
                body.position,
            )

        const intersection =
            event.ray.intersectPlane(
                dragPlane,
                dragIntersection,
            )

        if (!intersection) {
            return
        }

        grabOffset.subVectors(
            body.position,
            intersection,
        )

        dragPointerId.current =
            event.pointerId

        lastDragPosition.copy(
            body.position,
        )

        lastDragTime.current =
            performance.now()

        body.isKinematic = true

        body.velocity.set(
            0,
            0,
            0,
        )

        body.acceleration.set(
            0,
            0,
            0,
        )

        body.force.set(
            0,
            0,
            0,
        )

        body.previousPosition.copy(
            body.position,
        )

        setIsPressed(true)

        {
            (event.target as Element).setPointerCapture(
                event.pointerId,
            )
        }
    }

    function moveDrag(
        event:
            ThreeEvent<PointerEvent>,
    ): void {
        if (
            dragPointerId.current !==
            event.pointerId
        ) {
            return
        }

        event.stopPropagation()

        const intersection =
            event.ray.intersectPlane(
                dragPlane,
                dragIntersection,
            )

        if (!intersection) {
            return
        }

        dragTarget
            .copy(intersection)
            .add(grabOffset)

        body.position.copy(
            dragTarget,
        )

        clampBodyPositionToBounds(
            body,
        )

        body.previousPosition.copy(
            body.position,
        )

        const now =
            performance.now()

        const deltaSeconds =
            Math.max(
                (
                    now -
                    lastDragTime.current
                ) / 1000,
                1 / 240,
            )

        sampledVelocity
            .subVectors(
                body.position,
                lastDragPosition,
            )
            .multiplyScalar(
                1 / deltaSeconds,
            )

        body.velocity.lerp(
            sampledVelocity,
            DRAG_VELOCITY_BLEND,
        )

        if (
            body.velocity.lengthSq() >
            MAX_THROW_SPEED ** 2
        ) {
            body.velocity.setLength(
                MAX_THROW_SPEED,
            )
        }

        lastDragPosition.copy(
            body.position,
        )

        lastDragTime.current =
            now
    }

    function finishDrag(
        event:
            ThreeEvent<PointerEvent>,
        releaseCapture: boolean,
    ): void {
        if (
            dragPointerId.current !==
            event.pointerId
        ) {
            return
        }

        event.stopPropagation()

        const idleMilliseconds =
            performance.now() -
            lastDragTime.current

        if (
            idleMilliseconds >
            RELEASE_IDLE_THRESHOLD_MS
        ) {
            body.velocity.set(
                0,
                0,
                0,
            )
        }

        if (
            body.velocity.lengthSq() >
            MAX_THROW_SPEED ** 2
        ) {
            body.velocity.setLength(
                MAX_THROW_SPEED,
            )
        }

        body.isKinematic =
            false

        body.previousPosition.copy(
            body.position,
        )

        dragPointerId.current =
            null

        setIsPressed(false)

        if (releaseCapture) {
            (event.target as Element)
                .releasePointerCapture(
                    event.pointerId,
                )
        }
    }

    useFrame(
        (_, delta) => {
            const mesh =
                meshRef.current

            if (!mesh) {
                return
            }

            mesh.position.lerpVectors(
                body.previousPosition,
                body.position,
                interpolationAlpha.current,
            )

            mesh.rotation.y +=
                body.model.spinSpeed *
                delta

            mesh.rotation.x +=
                0.08 * delta

            const pulse =
                isPressed
                    ? 1.22
                    : isHovered
                        ? 1.08
                        : 1

            const targetScale =
                body.model.radius *
                pulse

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

            onPointerOver={(
                event,
            ) => {
                event.stopPropagation()

                setIsHovered(true)
            }}

            onPointerOut={() => {
                if (
                    dragPointerId.current !==
                    null
                ) {
                    return
                }

                setIsHovered(false)
                setIsPressed(false)
            }}

            onPointerDown={
                beginDrag
            }

            onPointerMove={
                moveDrag
            }

            onPointerUp={(
                event,
            ) => {
                finishDrag(
                    event,
                    true,
                )
            }}

            onPointerCancel={(
                event,
            ) => {
                finishDrag(
                    event,
                    false,
                )
            }}

            onClick={(event) => {
                event.stopPropagation()

                if (
                    event.delta > 2
                ) {
                    return
                }

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