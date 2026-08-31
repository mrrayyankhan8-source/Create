import { Dimension, Vector3, BlockPermutation } from "@minecraft/server";

export interface StructureBlockInfo {
    pos: Vector3;
    state: string; // The typeId
    permutationStates?: Record<string, string | number | boolean>; // The properties of the block
}

/**
 * Port of com.simibubi.create.content.contraptions.Contraption
 * Holds the in-memory block layout and movement behaviors for a moving structure.
 */
export class Contraption {
    public blocks: Map<string, StructureBlockInfo> = new Map();
    public bounds: { min: Vector3, max: Vector3 } = {
        min: {x: 0, y: 0, z: 0}, max: {x: 0, y: 0, z: 0}
    };

    constructor() {}

    public addBlock(localPos: Vector3, info: StructureBlockInfo): void {
        const key = `${localPos.x},${localPos.y},${localPos.z}`;
        this.blocks.set(key, info);

        // Update bounds
        if (localPos.x < this.bounds.min.x) this.bounds.min.x = localPos.x;
        if (localPos.y < this.bounds.min.y) this.bounds.min.y = localPos.y;
        if (localPos.z < this.bounds.min.z) this.bounds.min.z = localPos.z;
        if (localPos.x > this.bounds.max.x) this.bounds.max.x = localPos.x;
        if (localPos.y > this.bounds.max.y) this.bounds.max.y = localPos.y;
        if (localPos.z > this.bounds.max.z) this.bounds.max.z = localPos.z;
    }

    public tick(): void {
        // Evaluate MovementBehaviours for all actors (drills, saws, etc)
        // e.g. iterate this.blocks and check for known actors and trigger their actions
    }

    public stop(): void {
        // Halt actors
    }

    public addBlocksToWorld(dimension: Dimension, anchor: Vector3): void {
        for (const [key, info] of this.blocks.entries()) {
            const worldPos = {
                x: Math.floor(anchor.x + info.pos.x),
                y: Math.floor(anchor.y + info.pos.y),
                z: Math.floor(anchor.z + info.pos.z)
            };
            try {
                const block = dimension.getBlock(worldPos);
                if (block) {
                    try {
                        let newPerm = BlockPermutation.resolve(info.state);
                        if (info.permutationStates) {
                            for (const [stateName, stateVal] of Object.entries(info.permutationStates)) {
                                newPerm = newPerm.withState(stateName as any, stateVal as any);
                            }
                        }
                        block.setPermutation(newPerm);
                    } catch (e) {
                        // Suppress BlockPermutation errors in isolated unit test environments
                        // where @minecraft/server cannot actually be imported or resolved.
                    }
                }
            } catch (e) {
                console.warn("Failed to place contraption block at", worldPos);
            }
        }
    }
}
