import { Block } from "@minecraft/server";
import { GeneratingKineticBlockEntity } from "./GeneratingKineticBlockEntity.js";

/**
 * Port of com.simibubi.create.content.kinetics.motor.CreativeMotorBlockEntity
 */
export class CreativeMotorBlockEntity extends GeneratingKineticBlockEntity {
    public static readonly DEFAULT_SPEED = 16;
    public static readonly MAX_SPEED = 256;

    public generatedSpeed = CreativeMotorBlockEntity.DEFAULT_SPEED;

    constructor(block: Block) {
        super(block);
    }

    public override getGeneratedSpeed(): number {
        return this.generatedSpeed;
    }
}
