export function nextIndex(
    currentIndex: number,
    itemCount: number,
): number {
    if (!Number.isInteger(currentIndex)) {
        throw new Error('currentIndex must be an integer')
    }

    if (!Number.isInteger(itemCount) || itemCount <= 0) {
        throw new Error('itemCount must be a positive integer')
    }

    return (currentIndex + 1) % itemCount
}

export function damp(
    current: number,
    target: number,
    response: number,
    deltaSeconds: number,
): number {
    if (response < 0) {
        throw new Error('response must be non-negative')
    }

    if (deltaSeconds < 0) {
        throw new Error('deltaSeconds must be non-negative')
    }

    return (
        target +
        (current - target) *
        Math.exp(-response * deltaSeconds)
    )
}