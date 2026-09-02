import { Block, Vector3 } from "@minecraft/server";
import { KineticBlockEntity } from "./KineticBlockEntity.js";

/**
 * Port of com.simibubi.create.content.kinetics.base.DirectionalShaftHalvesBlockEntity
 */
export class DirectionalShaftHalvesBlockEntity extends KineticBlockEntity {

    public getSourceFacing(): string | null {
        if (!this.source) return null;
        const diff = {
            x: this.source.x - this.block.location.x,
            y: this.source.y - this.block.location.y,
            z: this.source.z - this.block.location.z
        };

        if (diff.x > 0 && diff.y === 0 && diff.z === 0) return "east";
        if (diff.x < 0 && diff.y === 0 && diff.z === 0) return "west";
        if (diff.x === 0 && diff.y > 0 && diff.z === 0) return "up";
        if (diff.x === 0 && diff.y < 0 && diff.z === 0) return "down";
        if (diff.x === 0 && diff.y === 0 && diff.z > 0) return "south";
        if (diff.x === 0 && diff.y === 0 && diff.z < 0) return "north";
        return null;
    }
}
