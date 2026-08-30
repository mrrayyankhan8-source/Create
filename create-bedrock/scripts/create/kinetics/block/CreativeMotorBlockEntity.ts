import { Block, Vector3 } from "@minecraft/server";
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
        this.capacity = 16384; // Value from Create Java default stress config for creative motor
    }

    public override getGeneratedSpeed(): number {
        // Normally this would read from the ScrollValueBehaviour
        return this.generatedSpeed;
    }

    public override calculateAddedStressCapacity(): number {
        return this.capacity; // Creative motor provides large capacity
    }
}
