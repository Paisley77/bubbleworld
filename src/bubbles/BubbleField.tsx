import {
    useEffect,
    useMemo,
    useRef,
} from 'react'

import {
    useFrame,
} from '@react-three/fiber'

import {
    SphereGeometry,
} from 'three'

import {
    createPhysicsWorld,
    stepPhysicsWorld,
} from '../physics/bubblePhysics'

import {
    Bubble,
} from './Bubble'

import {
    generateBubbleField,
} from './bubbleData'

const FIXED_TIME_STEP = 1 / 60
const MAX_FRAME_DELTA = 0.1
const STEP_EPSILON = 1e-10

interface BubbleFieldProps {
    count: number
    seed: number
}

export function BubbleField({
    count,
    seed,
}: BubbleFieldProps) {
    const models = useMemo(
        () =>
            generateBubbleField(
                count,
                seed,
            ),
        [
            count,
            seed,
        ],
    )

    const world = useMemo(
        () =>
            createPhysicsWorld(models),
        [models],
    )

    const geometry = useMemo(
        () =>
            new SphereGeometry(
                1,
                32,
                24,
            ),
        [],
    )

    const accumulator = useRef(0)

    const interpolationAlpha =
        useRef(0)

    useEffect(() => {
        accumulator.current = 0

        interpolationAlpha.current = 0
    }, [world])

    useEffect(() => {
        return () => {
            geometry.dispose()
        }
    }, [geometry])

    useFrame(
        (_, frameDelta) => {
            const safeDelta = Math.min(
                frameDelta,
                MAX_FRAME_DELTA,
            )

            accumulator.current +=
                safeDelta

            while (
                accumulator.current +
                STEP_EPSILON >=
                FIXED_TIME_STEP
            ) {
                stepPhysicsWorld(
                    world,
                    FIXED_TIME_STEP,
                )

                accumulator.current =
                    Math.max(
                        0,
                        accumulator.current -
                        FIXED_TIME_STEP,
                    )
            }

            interpolationAlpha.current =
                accumulator.current /
                FIXED_TIME_STEP
        },
        -2,
    )

    return (
        <group>
            {world.bodies.map(
                (body) => (
                    <Bubble
                        key={body.model.id}
                        body={body}
                        geometry={geometry}
                        interpolationAlpha={
                            interpolationAlpha
                        }
                    />
                ),
            )}
        </group>
    )
}