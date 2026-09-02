import { Block } from "@minecraft/server";
import { RotatedPillarKineticBlockEntity } from "./RotatedPillarKineticBlockEntity.js";

/**
 * Port of com.simibubi.create.content.kinetics.simpleRelays.CogWheelBlock
 */
export class CogwheelBlockEntity extends RotatedPillarKineticBlockEntity {
    public isLarge: boolean;

    constructor(block: Block, isLarge: boolean = false) {
        super(block);
        this.isLarge = isLarge;
    }

    // Cogwheel specific logic (e.g., propagation through teeth)
}
