import { BaseKineticNode } from "../kinetic/KineticNode";

export interface TransportedItem {
    itemTypeId: string;
    amount: number;
    progress: number; // 0.0 to 1.0 along the segment
}

export class Belt extends BaseKineticNode {

    public items: TransportedItem[] = [];
    public length: number;

    constructor(id: string, length: number = 1.0) {
        super(id);
        this.length = length;
    }

    getStressImpact(): number {
        // Stress impact scales with length
        return 1 * this.length;
    }

    public insertItem(itemTypeId: string, amount: number): boolean {
        // Items take up roughly 0.1 length units of space
        const spaceNeeded = 0.1 / this.length;
        if (this.items.some(i => i.progress < spaceNeeded)) {
            return false; // No room at the start
        }

        this.items.push({ itemTypeId, amount, progress: 0.0 });
        return true;
    }

    public extractItem(): TransportedItem | null {
        const index = this.items.findIndex(i => i.progress >= 1.0);
        if (index !== -1) {
            return this.items.splice(index, 1)[0];
        }
        return null;
    }

    public tick(deltaTime: number) {
        if (this.speed === 0) return;

        // Speed scaling
        const direction = Math.sign(this.speed);
        const speedMagnitude = Math.abs(this.speed);

        // e.g. 1 RPM = 0.1 blocks per second
        const step = (speedMagnitude * deltaTime * 0.1) / this.length;

        // Note: For simplicity, assuming belt always goes forward (direction = 1) for insertions.
        // A real system handles items going backwards and dropping off the front.

        // Sort items by progress to handle collisions
        this.items.sort((a, b) => b.progress - a.progress);

        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            let maxProgress = 1.0;

            // Item spacing
            const itemSpacing = 0.1 / this.length;

            if (i > 0) {
                const itemAhead = this.items[i - 1];
                maxProgress = itemAhead.progress - itemSpacing;
            }

            // Move item forward
            item.progress = Math.min(maxProgress, item.progress + step);
        }
    }
}
