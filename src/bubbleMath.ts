export function floatingOffset(elapsedSeconds: number, amplitude = 0.22, speed = 0.9,): number { return Math.sin(elapsedSeconds * speed) * amplitude }
export function nextIndex(currentIndex: number, itemCount: number): number {
    if (!Number.isInteger(currentIndex)) { throw new Error('currentIndex must be an integer') }
    if (!Number.isInteger(itemCount) || itemCount <= 0) { throw new Error('itemCount must be a positive integer') }
    return (currentIndex + 1) % itemCount;
}