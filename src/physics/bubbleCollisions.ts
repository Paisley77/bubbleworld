import {
    Vector3,
} from 'three'

import type {
    BubbleBody,
    PhysicsConfig,
} from './physicsTypes'

const COLLISION_EPSILON = 1e-12

const separation = new Vector3()
const collisionNormal = new Vector3()
const relativeVelocity = new Vector3()

function resolveBubblePair(
    bodyA: BubbleBody,
    bodyB: BubbleBody,
    config: PhysicsConfig,
): boolean {
    separation.subVectors(
        bodyB.position,
        bodyA.position,
    )

    const combinedRadius =
        bodyA.model.radius +
        bodyB.model.radius

    const combinedRadiusSquared =
        combinedRadius *
        combinedRadius

    const distanceSquared =
        separation.lengthSq()

    if (
        distanceSquared >=
        combinedRadiusSquared
    ) {
        return false
    }

    let distance: number

    if (
        distanceSquared >
        COLLISION_EPSILON
    ) {
        distance =
            Math.sqrt(distanceSquared)

        collisionNormal.copy(
            separation,
        )

        collisionNormal.multiplyScalar(
            1 / distance,
        )
    } else {
        distance = 0

        relativeVelocity.subVectors(
            bodyB.velocity,
            bodyA.velocity,
        )

        if (
            relativeVelocity.lengthSq() >
            COLLISION_EPSILON
        ) {
            collisionNormal
                .copy(relativeVelocity)
                .normalize()
        } else {
            collisionNormal.set(
                1,
                0,
                0,
            )
        }
    }

    const penetration =
        combinedRadius -
        distance

    const inverseMassA =
        1 / bodyA.mass

    const inverseMassB =
        1 / bodyB.mass

    const inverseMassSum =
        inverseMassA +
        inverseMassB

    const correctionDepth =
        Math.max(
            penetration -
            config.collisionSlop,
            0,
        )

    const correctionMagnitude =
        (
            correctionDepth *
            config.collisionCorrectionPercent
        ) /
        inverseMassSum

    bodyA.position.addScaledVector(
        collisionNormal,
        -correctionMagnitude *
        inverseMassA,
    )

    bodyB.position.addScaledVector(
        collisionNormal,
        correctionMagnitude *
        inverseMassB,
    )

    relativeVelocity.subVectors(
        bodyB.velocity,
        bodyA.velocity,
    )

    const velocityAlongNormal =
        relativeVelocity.dot(
            collisionNormal,
        )

    if (
        velocityAlongNormal >= 0
    ) {
        return true
    }

    const impulseMagnitude =
        (
            -(1 +
                config.bubbleRestitution) *
            velocityAlongNormal
        ) /
        inverseMassSum

    bodyA.velocity.addScaledVector(
        collisionNormal,
        -impulseMagnitude *
        inverseMassA,
    )

    bodyB.velocity.addScaledVector(
        collisionNormal,
        impulseMagnitude *
        inverseMassB,
    )

    return true
}

export function resolveBubbleCollisions(
    bodies: BubbleBody[],
    config: PhysicsConfig,
): number {
    let collisionCount = 0

    for (
        let a = 0;
        a < bodies.length - 1;
        a += 1
    ) {
        for (
            let b = a + 1;
            b < bodies.length;
            b += 1
        ) {
            const bodyA = bodies[a]
            const bodyB = bodies[b]

            if (
                resolveBubblePair(
                    bodyA,
                    bodyB,
                    config,
                )
            ) {
                collisionCount += 1
            }
        }
    }

    return collisionCount
}