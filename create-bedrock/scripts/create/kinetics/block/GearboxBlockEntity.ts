import { DirectionalShaftHalvesBlockEntity } from "./DirectionalShaftHalvesBlockEntity.js";

/**
 * Port of com.simibubi.create.content.kinetics.gearbox.GearboxBlockEntity
 */
export class GearboxBlockEntity extends DirectionalShaftHalvesBlockEntity {

    public getAxis(): string {
        const state = this.block.permutation.getState("minecraft:block_face");
        if (state === "up" || state === "down") return "y";
        if (state === "east" || state === "west") return "x";
        if (state === "north" || state === "south") return "z";
        return "y";
    }

    public override needsVisualEntity(): boolean {
        // Gearbox rendering will use model logic instead of a simple entity,
        // but for now we'll spawn the visual dummy for consistency and to hook animation
        return true;
    }

    public override getVisualEntityId(): string | undefined {
        return "create:gearbox_visual";
    }
}
