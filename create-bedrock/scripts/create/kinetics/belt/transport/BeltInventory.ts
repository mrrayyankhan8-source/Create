import { ItemStack } from "@minecraft/server";
import { BeltBlockEntity } from "../BeltBlockEntity.js";
import { TransportedItemStack } from "./TransportedItemStack.js";

/**
 * Port of com.simibubi.create.content.kinetics.belt.transport.BeltInventory
 */
export class BeltInventory {
    public belt: BeltBlockEntity;
    public items: TransportedItemStack[] = [];
    private toInsert: TransportedItemStack[] = [];
    private toRemove: TransportedItemStack[] = [];

    public beltMovementPositive: boolean = true;

    constructor(belt: BeltBlockEntity) {
        this.belt = belt;
    }

    public tick(): void {
        const speed = this.belt.getSpeed();
        if (speed === 0) return;

        // Process item movement FIRST so we can safely flush next
        this.beltMovementPositive = this.belt.getDirectionAwareBeltMovementSpeed() > 0;
        const movement = this.belt.getDirectionAwareBeltMovementSpeed();

        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            item.prevBeltPosition = item.beltPosition;
            item.prevSideOffset = item.sideOffset;

            if (item.locked) continue;

            const nextOffset = item.beltPosition + movement;

            // Assume no blockage for basic implementation
            item.beltPosition = nextOffset;

            // Check eject (reach end of belt)
            if (this.beltMovementPositive && item.beltPosition >= this.belt.beltLength) {
                this.eject(item);
                this.toRemove.push(item);
            } else if (!this.beltMovementPositive && item.beltPosition <= 0) {
                this.eject(item);
                this.toRemove.push(item);
            }
        }

        // Process Removes
        this.items = this.items.filter(i => !this.toRemove.includes(i));
        this.toRemove = [];

        // Process Inserts
        for (const item of this.toInsert) {
            this.insert(item);
        }
        this.toInsert = [];
    }

    public insert(newStack: TransportedItemStack): void {
        this.items.push(newStack);
        this.items.sort((a, b) => {
            if (this.beltMovementPositive) return b.beltPosition - a.beltPosition;
            return a.beltPosition - b.beltPosition;
        });
    }

    public addItem(stack: TransportedItemStack): void {
        this.toInsert.push(stack);
    }

    private eject(stack: TransportedItemStack): void {
        // Eject item into world
        const dim = this.belt.block.dimension;
        // Approximation of end position:
        // Proper math requires BeltHelper offset logic. For now, drop at block.
        const endPos = {
            x: this.belt.block.location.x + 0.5,
            y: this.belt.block.location.y + 0.5,
            z: this.belt.block.location.z + 0.5
        };
        try {
            dim.spawnItem(stack.stack, endPos);
        } catch (e) {
            // Fails in test environments
        }
    }
}
