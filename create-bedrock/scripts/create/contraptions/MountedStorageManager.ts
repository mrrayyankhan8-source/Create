import { Block, Container, ItemStack, Player } from "@minecraft/server";
import { Contraption } from "./Contraption.js";

/**
 * Port of com.simibubi.create.content.contraptions.MountedStorageManager
 * Simulates storage interactions and tracking for blocks within a moving contraption.
 */
export class MountedStorageManager {
    // Map of local position string to the cloned container
    public itemStorages = new Map<string, ItemStack[]>();

    public attachBlock(localPos: {x: number, y: number, z: number}, block: Block): boolean {
        const inventory = block.getComponent("minecraft:inventory") as any;
        if (!inventory || !inventory.container) {
            return false;
        }

        const container: Container = inventory.container;
        const items: ItemStack[] = [];
        let hasItems = false;

        for (let i = 0; i < container.size; i++) {
            const item = container.getItem(i);
            if (item) {
                items[i] = item;
                hasItems = true;
            }
        }

        if (hasItems || container.size > 0) {
            const posKey = `${localPos.x},${localPos.y},${localPos.z}`;
            this.itemStorages.set(posKey, items);
            // Storage has been mounted, we should clear the world block's container so it doesn't duplicate
            try { container.clearAll(); } catch(e) {}
            return true;
        }

        return false;
    }

    public unmount(localPos: {x: number, y: number, z: number}, worldBlock: Block): void {
        const posKey = `${localPos.x},${localPos.y},${localPos.z}`;
        const items = this.itemStorages.get(posKey);

        if (items) {
            const inventory = worldBlock.getComponent("minecraft:inventory") as any;
            if (inventory && inventory.container) {
                const container: Container = inventory.container;
                for (let i = 0; i < items.length; i++) {
                    if (items[i]) {
                        // Place item back in real world block
                        try { container.setItem(i, items[i]); } catch (e) {}
                    }
                }
            }
            this.itemStorages.delete(posKey);
        }
    }
}
