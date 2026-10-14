import {
    useEffect,
    useMemo,
} from 'react'

import {
    SphereGeometry,
} from 'three'

import {
    Bubble,
} from './Bubble'

import {
    generateBubbleField,
} from './bubbleData'

interface BubbleFieldProps {
    count: number

    seed: number
}

export function BubbleField({
    count,
    seed,
}: BubbleFieldProps) {
    const bubbles =
        useMemo(
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

    const geometry =
        useMemo(
            () =>
                new SphereGeometry(
                    1,
                    32,
                    24,
                ),

            [],
        )

    useEffect(() => {
        return () => {
            geometry.dispose()
        }
    }, [geometry])

    return (
        <group>
            {bubbles.map(
                (bubble) => (
                    <Bubble
                        key={
                            bubble.id
                        }

                        bubble={
                            bubble
                        }

                        geometry={
                            geometry
                        }
                    />
                ),
            )}
        </group>
    )
}