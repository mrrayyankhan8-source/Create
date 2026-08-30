import { Block } from "@minecraft/server";
import { BracketedKineticBlockEntity } from "./BracketedKineticBlockEntity.js";

/**
 * Port of com.simibubi.create.content.kinetics.base.RotatedPillarKineticBlock
 */
export class RotatedPillarKineticBlockEntity extends BracketedKineticBlockEntity {

    public getAxis(): string {
        try {
            const axis = this.block.permutation.getState("minecraft:block_face");
            if (axis === "up" || axis === "down") return "y";
            if (axis === "north" || axis === "south") return "z";
            if (axis === "east" || axis === "west") return "x";
        } catch (e) {
            // Default
        }
        return "y";
    }

    protected override syncSpeedToEntity(): void {
        const dimension = this.block.dimension;
        const pos = this.block.location;
        const entities = dimension.getEntitiesAtBlockLocation(pos);
        for (const entity of entities) {
            if (entity.typeId.includes("shaft") || entity.typeId.includes("cogwheel")) {
                entity.setProperty("create:rpm", this.speed);
            }
        }
    }
}
