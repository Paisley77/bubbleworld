export type Vector3Tuple = [
    number,
    number,
    number,
]

export interface BubbleModel {
    id: string
    name: string

    initialPosition: Vector3Tuple
    initialVelocity: Vector3Tuple

    radius: number
    paletteIndex: number

    driftPhase: number
    buoyancyScale: number
    spinSpeed: number
}