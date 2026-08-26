/**
 * Tick Manager
 * Handles varying frequencies of update loops.
 */

export type TickCallback = (deltaTime: number) => void;

export class TickManager {
    private highFrequencyCallbacks: TickCallback[] = [];
    private normalFrequencyCallbacks: TickCallback[] = [];
    private lowFrequencyCallbacks: TickCallback[] = [];

    private tickCount: number = 0;

    constructor() {}

    public registerHighFrequency(callback: TickCallback) {
        this.highFrequencyCallbacks.push(callback);
    }

    public registerNormalFrequency(callback: TickCallback) {
        this.normalFrequencyCallbacks.push(callback);
    }

    public registerLowFrequency(callback: TickCallback) {
        this.lowFrequencyCallbacks.push(callback);
    }

    /**
     * Call this from the system tick event.
     * deltaTime is typically 0.05s (50ms) per tick in Minecraft.
     */
    public onTick(deltaTime: number = 0.05) {
        this.tickCount++;

        // High frequency (every tick)
        for (const cb of this.highFrequencyCallbacks) {
            cb(deltaTime);
        }

        // Normal frequency (e.g. every 2 ticks)
        if (this.tickCount % 2 === 0) {
            for (const cb of this.normalFrequencyCallbacks) {
                cb(deltaTime * 2);
            }
        }

        // Low frequency (e.g. every 20 ticks / 1 second)
        if (this.tickCount % 20 === 0) {
            for (const cb of this.lowFrequencyCallbacks) {
                cb(deltaTime * 20);
            }
        }
    }
}
