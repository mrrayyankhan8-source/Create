import { BlockCustomComponent, BlockComponentTickEvent } from "@minecraft/server";
import { RedstoneContactBlockEntity } from "./RedstoneContactBlockEntity.js";

/**
 * Native Bedrock custom component for Redstone Contact logic
 */
export class RedstoneContactComponent implements BlockCustomComponent {
    public onTick(event: BlockComponentTickEvent): void {
        const block = event.block;
        const be = new RedstoneContactBlockEntity(block);

        // Face detection logic: check adjacent block in facing direction for another contact
        const facingStr = block.permutation.getState("minecraft:block_face") as string || "up";
        const offset = this.getDirectionOffset(facingStr);

        try {
            const adjBlock = block.dimension.getBlock({x: block.x + offset.x, y: block.y + offset.y, z: block.z + offset.z});
            if (adjBlock && adjBlock.typeId === "create:redstone_contact") {
                const adjFacing = adjBlock.permutation.getState("minecraft:block_face") as string;
                // Simplified contact logic: are they facing each other?
                if (this.isOpposite(facingStr, adjFacing)) {
                    be.updateContactState(true);
                    return;
                }
            }
            be.updateContactState(false);
        } catch(e) {
            be.updateContactState(false);
        }
    }

    private getDirectionOffset(face: string): {x: number, y: number, z: number} {
        switch(face) {
            case "up": return {x:0, y:1, z:0};
            case "down": return {x:0, y:-1, z:0};
            case "north": return {x:0, y:0, z:-1};
            case "south": return {x:0, y:0, z:1};
            case "west": return {x:-1, y:0, z:0};
            case "east": return {x:1, y:0, z:0};
            default: return {x:0, y:1, z:0};
        }
    }

    private isOpposite(f1: string, f2: string): boolean {
        if (f1 === "up" && f2 === "down") return true;
        if (f1 === "down" && f2 === "up") return true;
        if (f1 === "north" && f2 === "south") return true;
        if (f1 === "south" && f2 === "north") return true;
        if (f1 === "east" && f2 === "west") return true;
        if (f1 === "west" && f2 === "east") return true;
        return false;
    }
}
