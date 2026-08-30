import { DirectionalShaftHalvesBlockEntity } from "./DirectionalShaftHalvesBlockEntity.js";

/**
 * Port of com.simibubi.create.content.kinetics.transmission.SplitShaftBlockEntity
 */
export abstract class SplitShaftBlockEntity extends DirectionalShaftHalvesBlockEntity {

    public abstract getRotationSpeedModifier(face: string): number;

    public getAxis(): string {
        const state = this.block.permutation.getState("minecraft:block_face");
        if (state === "up" || state === "down") return "y";
        if (state === "east" || state === "west") return "x";
        if (state === "north" || state === "south") return "z";
        return "y";
    }
}
