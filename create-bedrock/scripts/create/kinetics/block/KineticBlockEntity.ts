import { Block, Dimension, Vector3 } from "@minecraft/server";
import { KineticNetwork } from "../network/KineticNetwork.js";

/**
 * Port of com.simibubi.create.content.kinetics.base.KineticBlockEntity
 */
export abstract class KineticBlockEntity {
    public block: Block;
    public network: KineticNetwork | null = null;
    public networkDirty: boolean = false;
    public updateSpeedRequested: boolean = true;
    public preventSpeedUpdate: number = 0;

    protected speed: number = 0;
    protected capacity: number = 0;
    protected stress: number = 0;
    protected overStressed: boolean = false;
    protected wasMoved: boolean = false;

    protected lastStressApplied: number = 0;
    protected lastCapacityProvided: number = 0;

    constructor(block: Block) {
        this.block = block;
    }

    public abstract isSource(): boolean;

    public getGeneratedSpeed(): number {
        return 0;
    }

    public getTheoreticalSpeed(): number {
        return this.speed;
    }

    public calculateAddedStressCapacity(): number {
        const capacity = this.capacity;
        this.lastCapacityProvided = capacity;
        return capacity;
    }

    public calculateStressApplied(): number {
        const stress = this.stress;
        this.lastStressApplied = stress;
        return stress;
    }

    public updateOverStressed(overStressed: boolean): boolean {
        const changed = this.overStressed !== overStressed;
        this.overStressed = overStressed;
        return changed;
    }

    public updateSpeed(): void {
        this.updateSpeedRequested = true;
        // Logic to trigger visual entity updates for rotation will happen here
    }

    public tick(): void {
        if (this.updateSpeedRequested && this.preventSpeedUpdate === 0) {
            this.attachKinetics();
        }
    }

    public attachKinetics(): void {
        this.updateSpeedRequested = false;
        // Will delegate to RotationPropagator equivalent
    }

    public setSpeed(speed: number): void {
        if (this.speed === speed) return;
        this.speed = speed;
        // In Bedrock, we must sync this to the corresponding visual entity
        this.syncSpeedToEntity();
    }

    protected syncSpeedToEntity(): void {
        // Find visual entity near block and update 'create:rpm' property
    }
}
