import type { BubbleModel } from './bubbleTypes'

export const BUBBLE_COLORS = [
    '#7dd3fc',
    '#c4b5fd',
    '#f9a8d4',
    '#86efac',
    '#fde68a',
    '#fb7185',
]

function createSeededRandom(seed: number): () => number {
    if (!Number.isInteger(seed)) { throw new Error('seed must be an integer') }
    let state = seed >>> 0
    return () => {
        state = (state + 0x6d2b79f5) >>> 0
        let value = state
        value = Math.imul(value ^ (value >>> 15), value | 1)
        value ^= (value + Math.imul(value ^ (value >>> 7), value | 61))
        return ((value ^ (value >>> 14)) >>> 0) / 4294967296
    }
}

function randomBetween(
    random: () => number,
    min: number,
    max: number,
): number {
    return min + (max - min) * random()
}

export function generateBubbleField(
    count: number,
    seed = 1337,
): BubbleModel[] {
    if (
        !Number.isInteger(count) ||
        count < 0
    ) {
        throw new Error(
            'count must be a non-negative integer',
        )
    }

    const random = createSeededRandom(seed)

    return Array.from(
        { length: count },

        (_, index) => {
            const radius = randomBetween(
                random,
                0.24,
                0.56,
            )

            return {
                id:
                    `bubble-${index
                        .toString()
                        .padStart(3, '0')}`,

                name: `Bubble ${index + 1}`,

                position: [
                    randomBetween(
                        random,
                        -2.7 + radius,
                        2.7 - radius,
                    ),

                    randomBetween(
                        random,
                        -2.2 + radius,
                        2.2 - radius,
                    ),

                    randomBetween(
                        random,
                        -1.8,
                        1.1,
                    ),
                ],

                radius,

                paletteIndex:
                    Math.floor(
                        random() *
                        BUBBLE_COLORS.length,
                    ),

                floatAmplitude:
                    randomBetween(
                        random,
                        0.08,
                        0.28,
                    ),

                floatSpeed:
                    randomBetween(
                        random,
                        0.45,
                        1.05,
                    ),

                floatPhase:
                    randomBetween(
                        random,
                        0,
                        Math.PI * 2,
                    ),

                spinSpeed:
                    randomBetween(
                        random,
                        -0.22,
                        0.22,
                    ),
            }
        },
    )
}