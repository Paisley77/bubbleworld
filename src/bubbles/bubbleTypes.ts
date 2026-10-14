export type Vector3Tuple = [
    number, number, number
]

export interface BubbleModel {
    id: string
    name: string
    position: Vector3Tuple
    radius: number
    paletteIndex: number
    floatAmplitude: number
    floatSpeed: number
    floatPhase: number
    spinSpeed: number
}