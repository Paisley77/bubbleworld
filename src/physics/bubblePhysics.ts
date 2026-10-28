import {
    Vector3,
} from 'three'

import type {
    BubbleModel,
} from '../bubbles/bubbleTypes'

import {
    resolveBubbleCollisions,
} from './bubbleCollisions'

import type {
    BubbleBody,
    PhysicsConfig,
    PhysicsWorld,
} from './physicsTypes'

export const PHYSICS_CONFIG: PhysicsConfig = {
    bounds: {
        min: new Vector3(
            -2.9,
            -2.4,
            -2.0,
        ),

        max: new Vector3(
            2.9,
            2.4,
            1.2,
        ),
    },

    wallRestitution: 0.84,
    bubbleRestitution: 0.92,

    linearDrag: 0.14,

    buoyancyAcceleration: 0.08,
    windAcceleration: 0.32,
    depthAcceleration: 0.16,

    maxSpeed: 1.4,

    collisionCorrectionPercent: 0.8,
    collisionSlop: 0.001,
    collisionIterations: 2,
}

function calculateMass(
    radius: number,
): number {
    return 0.5 + 4 * radius ** 3
}

export function createPhysicsWorld(
    models: BubbleModel[],
): PhysicsWorld {
    const bodies = models.map(
        (model): BubbleBody => {
            const position =
                new Vector3(
                    ...model.initialPosition,
                )

            return {
                model,

                mass: calculateMass(
                    model.radius,
                ),

                position,

                previousPosition:
                    position.clone(),

                velocity:
                    new Vector3(
                        ...model.initialVelocity,
                    ),

                acceleration:
                    new Vector3(),

                force:
                    new Vector3(),
            }
        },
    )

    return {
        bodies,
        time: 0,
    }
}

function accumulateAmbientForces(
    body: BubbleBody,
    worldTime: number,
    config: PhysicsConfig,
): void {
    const phase =
        body.model.driftPhase

    const mass = body.mass

    body.force.x +=
        mass *
        Math.sin(
            worldTime * 0.75 +
            phase,
        ) *
        config.windAcceleration

    body.force.y +=
        mass *
        config.buoyancyAcceleration *
        body.model.buoyancyScale

    body.force.z +=
        mass *
        Math.cos(
            worldTime * 0.55 +
            phase * 1.7,
        ) *
        config.depthAcceleration
}

function integrateBody(
    body: BubbleBody,
    deltaSeconds: number,
    config: PhysicsConfig,
): void {
    body.acceleration
        .copy(body.force)
        .multiplyScalar(
            1 / body.mass,
        )

    body.velocity.addScaledVector(
        body.acceleration,
        deltaSeconds,
    )

    const dragMultiplier =
        Math.exp(
            -config.linearDrag *
            deltaSeconds,
        )

    body.velocity.multiplyScalar(
        dragMultiplier,
    )

    if (
        body.velocity.lengthSq() >
        config.maxSpeed ** 2
    ) {
        body.velocity.setLength(
            config.maxSpeed,
        )
    }

    body.position.addScaledVector(
        body.velocity,
        deltaSeconds,
    )
}

function resolveWorldBounds(
    body: BubbleBody,
    config: PhysicsConfig,
): void {
    const radius =
        body.model.radius

    const {
        min,
        max,
    } = config.bounds

    const minimumX =
        min.x + radius

    const maximumX =
        max.x - radius

    const minimumY =
        min.y + radius

    const maximumY =
        max.y - radius

    const minimumZ =
        min.z + radius

    const maximumZ =
        max.z - radius

    if (
        body.position.x <
        minimumX
    ) {
        body.position.x =
            minimumX

        if (
            body.velocity.x < 0
        ) {
            body.velocity.x =
                -body.velocity.x *
                config.wallRestitution
        }
    } else if (
        body.position.x >
        maximumX
    ) {
        body.position.x =
            maximumX

        if (
            body.velocity.x > 0
        ) {
            body.velocity.x =
                -body.velocity.x *
                config.wallRestitution
        }
    }

    if (
        body.position.y <
        minimumY
    ) {
        body.position.y =
            minimumY

        if (
            body.velocity.y < 0
        ) {
            body.velocity.y =
                -body.velocity.y *
                config.wallRestitution
        }
    } else if (
        body.position.y >
        maximumY
    ) {
        body.position.y =
            maximumY

        if (
            body.velocity.y > 0
        ) {
            body.velocity.y =
                -body.velocity.y *
                config.wallRestitution
        }
    }

    if (
        body.position.z <
        minimumZ
    ) {
        body.position.z =
            minimumZ

        if (
            body.velocity.z < 0
        ) {
            body.velocity.z =
                -body.velocity.z *
                config.wallRestitution
        }
    } else if (
        body.position.z >
        maximumZ
    ) {
        body.position.z =
            maximumZ

        if (
            body.velocity.z > 0
        ) {
            body.velocity.z =
                -body.velocity.z *
                config.wallRestitution
        }
    }
}

function resolveAllBounds(
    bodies: BubbleBody[],
    config: PhysicsConfig,
): void {
    for (
        const body of bodies
    ) {
        resolveWorldBounds(
            body,
            config,
        )
    }
}

export function stepPhysicsWorld(
    world: PhysicsWorld,
    deltaSeconds: number,
    config = PHYSICS_CONFIG,
): void {
    if (
        !Number.isFinite(
            deltaSeconds,
        ) ||
        deltaSeconds <= 0
    ) {
        throw new Error(
            'deltaSeconds must be a positive finite number',
        )
    }

    world.time +=
        deltaSeconds

    for (
        const body of world.bodies
    ) {
        body.previousPosition.copy(
            body.position,
        )

        body.force.set(
            0,
            0,
            0,
        )

        accumulateAmbientForces(
            body,
            world.time,
            config,
        )

        integrateBody(
            body,
            deltaSeconds,
            config,
        )
    }

    resolveAllBounds(
        world.bodies,
        config,
    )

    for (
        let iteration = 0;
        iteration <
        config.collisionIterations;
        iteration += 1
    ) {
        resolveBubbleCollisions(
            world.bodies,
            config,
        )

        resolveAllBounds(
            world.bodies,
            config,
        )
    }
}