import type {
    Vector3,
} from 'three'

import type {
    BubbleModel,
} from '../bubbles/bubbleTypes'

export interface WorldBounds {
    min: Vector3
    max: Vector3
}

export interface PhysicsConfig {
    bounds: WorldBounds

    restitution: number
    linearDrag: number

    buoyancyAcceleration: number
    windAcceleration: number
    depthAcceleration: number

    maxSpeed: number
}

export interface BubbleBody {
    model: BubbleModel
    mass: number

    position: Vector3
    previousPosition: Vector3
    velocity: Vector3
    acceleration: Vector3
    force: Vector3
}

export interface PhysicsWorld {
    bodies: BubbleBody[]
    time: number
}