import { Block, Container } from "@minecraft/server";
import { KineticBlockManager } from "./KineticBlockManager.js";

/**
 * Port of com.simibubi.create.content.processing.basin.BasinBlockEntity
 * Note: Basin is NOT a KineticBlockEntity, it just holds fluids and items.
 */
export class BasinBlockEntity {
    public block: Block;

    constructor(block: Block) {
        this.block = block;
    }

    public getInventory(): Container | undefined {
        const invComp = this.block.getComponent("minecraft:inventory") as any;
        return invComp?.container;
    }
}
