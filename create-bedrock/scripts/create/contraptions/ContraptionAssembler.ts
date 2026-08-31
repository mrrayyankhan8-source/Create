import { Dimension, Vector3, Block } from "@minecraft/server";
import { Contraption, StructureBlockInfo } from "./Contraption.js";

/**
 * Port of com.simibubi.create.content.contraptions.Contraption.searchMovedStructure
 * Handles BFS traversal to detect attached blocks and form a Contraption.
 */
export class ContraptionAssembler {

    /**
     * Determines if a block is moveable. Bedrock doesn't have Java's exact material properties
     * so we use a simple block exclusion check for bedrock equivalents.
     */
    private static isMovementAllowed(block: Block): boolean {
        const id = block.typeId;
        if (id === "minecraft:bedrock") return false;
        if (id === "minecraft:obsidian") return false;
        if (id.includes("command_block")) return false;
        if (id === "minecraft:end_portal_frame") return false;
        return true;
    }

    private static getOffsetPos(pos: Vector3, dir: string): Vector3 {
        let x = pos.x, y = pos.y, z = pos.z;
        if (dir === "up") y += 1;
        if (dir === "down") y -= 1;
        if (dir === "north") z -= 1;
        if (dir === "south") z += 1;
        if (dir === "east") x += 1;
        if (dir === "west") x -= 1;
        return { x, y, z };
    }

    /**
     * Initiates the assembly of a contraption starting from an anchor block.
     * @param dimension Dimension of assembly
     * @param anchorPos The origin pos (e.g. the Mechanical Bearing)
     * @param maxBlocks The chassis/glue limit
     */
    public static assemble(dimension: Dimension, anchorPos: Vector3, maxBlocks: number = 2048): Contraption | null {
        const contraption = new Contraption();

        const frontier: Vector3[] = [];
        const visited: Set<string> = new Set();

        // Push anchor
        frontier.push(anchorPos);

        while (frontier.length > 0) {
            const currentPos = frontier.shift()!;
            const key = `${currentPos.x},${currentPos.y},${currentPos.z}`;

            if (visited.has(key)) continue;
            visited.add(key);

            if (visited.size > maxBlocks) {
                console.warn("Contraption Assembly exceeded maximum blocks!");
                return null;
            }

            let block: Block;
            try {
                block = dimension.getBlock(currentPos)!;
            } catch (e) {
                continue; // Unloaded chunks
            }

            if (!block || block.typeId === "minecraft:air" || !this.isMovementAllowed(block)) {
                continue;
            }

            // Record block into contraption relative to anchor
            const localPos = {
                x: currentPos.x - anchorPos.x,
                y: currentPos.y - anchorPos.y,
                z: currentPos.z - anchorPos.z
            };

            let statesToSave = {};
            if (block.permutation && typeof block.permutation.getAllStates === "function") {
                statesToSave = block.permutation.getAllStates();
            }

            const info: StructureBlockInfo = {
                pos: localPos,
                state: block.typeId,
                permutationStates: statesToSave as Record<string, string | number | boolean>
            };

            contraption.addBlock(localPos, info);

            // Temporary simple linear traversal for contiguous Create blocks
            if (block.typeId.includes("create:") || block.typeId.includes("chassis")) {
                const dirs = ["up", "down", "north", "south", "east", "west"];
                for (const d of dirs) {
                    const nextPos = this.getOffsetPos(currentPos, d);
                    frontier.push(nextPos);
                }
            }
        }

        return contraption;
    }
}
