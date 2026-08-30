import { Block } from "@minecraft/server";
import { KineticBlockEntity } from "./KineticBlockEntity.js";

/**
 * Port of com.simibubi.create.content.kinetics.base.RotatedPillarKineticBlock
 */
export class RotatedPillarKineticBlockEntity extends KineticBlockEntity {

    public isSource(): boolean {
        return false;
    }

    public getAxis(): string {
        try {
            const axis = this.block.permutation.getState("minecraft:block_face");
            if (axis === "up" || axis === "down") return "y";
            if (axis === "north" || axis === "south") return "z";
            if (axis === "east" || axis === "west") return "x";
        } catch (e) {
            // Default to Y if block doesn't have the property
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
                // The visual rendering in Bedrock entities usually depends on this rpm value
            }
        }
    }
}
