import { Block } from "@minecraft/server";

/**
 * Port of com.simibubi.create.api.stress.BlockStressValues
 * Provides central registry for stress impacts and capacities per block type.
 */
export class BlockStressValues {
    private static impacts: Map<string, () => number> = new Map();
    private static capacities: Map<string, () => number> = new Map();

    public static registerImpact(identifier: string, supplier: () => number): void {
        this.impacts.set(identifier, supplier);
    }

    public static registerCapacity(identifier: string, supplier: () => number): void {
        this.capacities.set(identifier, supplier);
    }

    public static getImpact(blockOrId: Block | string): number {
        const id = typeof blockOrId === "string" ? blockOrId : blockOrId.typeId;
        const supplier = this.impacts.get(id);
        return supplier ? supplier() : 0;
    }

    public static getCapacity(blockOrId: Block | string): number {
        const id = typeof blockOrId === "string" ? blockOrId : blockOrId.typeId;
        const supplier = this.capacities.get(id);
        return supplier ? supplier() : 0;
    }
}
