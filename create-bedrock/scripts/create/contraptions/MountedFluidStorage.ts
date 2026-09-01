import { Block } from "@minecraft/server";
import { Contraption } from "./Contraption.js";

/**
 * Port of com.simibubi.create.api.contraption.storage.fluid.MountedFluidStorage
 * Because standard Bedrock block fluid handling via custom blocks relies largely on tags/inventories holding buckets,
 * this acts as a placeholder for when a proper robust fluid API (or our custom one) gets fully ported.
 */
export class MountedFluidStorage {
    public fluidTanks = new Map<string, { fluid: string, amount: number }>();

    public attachBlock(localPos: {x: number, y: number, z: number}, block: Block): boolean {
        // Stub: Checks if block is a Fluid Tank, stores its fluid volume, and empties the real world block.
        if (block.typeId === "create:fluid_tank") {
            const posKey = `${localPos.x},${localPos.y},${localPos.z}`;
            // Simulating extraction of 1000mB of water for testing purposes if it was a tank
            this.fluidTanks.set(posKey, { fluid: "minecraft:water", amount: 0 });
            return true;
        }
        return false;
    }

    public unmount(localPos: {x: number, y: number, z: number}, worldBlock: Block): void {
        const posKey = `${localPos.x},${localPos.y},${localPos.z}`;
        const tank = this.fluidTanks.get(posKey);

        if (tank) {
            // Restore fluid to the world block here
            this.fluidTanks.delete(posKey);
        }
    }
}
