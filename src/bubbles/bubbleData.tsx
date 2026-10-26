import type {
    BubbleModel,
} from './bubbleTypes'

export const BUBBLE_COLORS = [
    '#7dd3fc',
    '#c4b5fd',
    '#f9a8d4',
    '#86efac',
    '#fde68a',
    '#fb7185',
]

function createSeededRandom(
    seed: number,
): () => number {
    if (!Number.isInteger(seed)) {
        throw new Error('seed must be an integer')
    }

    let state = seed >>> 0

    return () => {
        state = (
            state + 0x6d2b79f5
        ) >>> 0

        let value = state

        value = Math.imul(
            value ^ (value >>> 15),
            value | 1,
        )

        value ^= (
            value +
            Math.imul(
                value ^ (value >>> 7),
                value | 61,
            )
        )

        return (
            (value ^ (value >>> 14)) >>> 0
        ) / 4294967296
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

                initialPosition: [
                    randomBetween(
                        random,
                        -2.5 + radius,
                        2.5 - radius,
                    ),

                    randomBetween(
                        random,
                        -1.9 + radius,
                        1.9 - radius,
                    ),

                    randomBetween(
                        random,
                        -1.6 + radius,
                        0.8 - radius,
                    ),
                ],

                initialVelocity: [
                    randomBetween(
                        random,
                        -0.55,
                        0.55,
                    ),

                    randomBetween(
                        random,
                        -0.35,
                        0.4,
                    ),

                    randomBetween(
                        random,
                        -0.35,
                        0.35,
                    ),
                ],

                radius,

                paletteIndex:
                    Math.floor(
                        random() *
                        BUBBLE_COLORS.length,
                    ),

                driftPhase:
                    randomBetween(
                        random,
                        0,
                        Math.PI * 2,
                    ),

                buoyancyScale:
                    randomBetween(
                        random,
                        0.7,
                        1.3,
                    ),

                spinSpeed:
                    randomBetween(
                        random,
                        -0.25,
                        0.25,
                    ),
            }
        },
    )
}