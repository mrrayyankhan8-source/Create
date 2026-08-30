import { Block, Dimension, Vector3 } from "@minecraft/server";
import { TorquePropagator } from "../network/TorquePropagator.js";
import { BlockStressValues } from "../../api/stress/BlockStressValues.js";

let rotationPropagatorClass: any = null;
function getRotationPropagator() {
    if (!rotationPropagatorClass) {
        rotationPropagatorClass = require("../propagation/RotationPropagator.js").RotationPropagator;
    }
    return rotationPropagatorClass;
}

export class KineticBlockEntity {
    public block: Block;
    public network: any | null = null;
    public networkId: number | null = null;
    public source: Vector3 | null = null;

    public networkDirty: boolean = false;
    public updateSpeedRequested: boolean = true;
    public preventSpeedUpdate: number = 0;

    protected speed: number = 0;
    protected capacity: number = 0;
    public stress: number = 0;
    protected overStressed: boolean = false;
    protected wasMoved: boolean = false;

    protected lastStressApplied: number = 0;
    protected lastCapacityProvided: number = 0;

    constructor(block: Block) {
        this.block = block;
    }

    public isSource(): boolean { return false; }
    public getGeneratedSpeed(): number { return 0; }
    public getTheoreticalSpeed(): number { return this.speed; }

    public getSpeed(): number {
        if (this.overStressed) return 0;
        return this.getTheoreticalSpeed();
    }

    protected getStressConfigKey(): string { return this.block.typeId; }

    public calculateAddedStressCapacity(): number {
        const capacity = BlockStressValues.getCapacity(this.getStressConfigKey());
        this.lastCapacityProvided = capacity;
        return capacity;
    }

    public calculateStressApplied(): number {
        const stress = BlockStressValues.getImpact(this.getStressConfigKey());
        this.lastStressApplied = stress;
        return stress;
    }

    public isOverStressed(): boolean {
        return this.overStressed;
    }

    public updateOverStressed(overStressed: boolean): boolean {
        const changed = this.overStressed !== overStressed;
        this.overStressed = overStressed;
        return changed;
    }

    public updateSpeed(): void {
        this.updateSpeedRequested = true;
    }

    public getOrCreateNetwork(): any {
        return TorquePropagator.getOrCreateNetworkFor(this);
    }

    public hasNetwork(): boolean {
        return this.network !== null || this.networkId !== null;
    }

    public tick(): void {
        if (this.updateSpeedRequested && this.preventSpeedUpdate === 0) {
            this.attachKinetics();
        }
    }

    public attachKinetics(): void {
        this.updateSpeedRequested = false;
        getRotationPropagator().handleAdded(this);
    }

    public detachKinetics(): void {
        getRotationPropagator().handleRemoved(this);
    }

    public remove(): void {
        if (this.hasNetwork()) {
            this.getOrCreateNetwork().remove(this);
        }
        this.detachKinetics();
    }

    public setSpeed(speed: number): void {
        if (this.speed === speed) return;
        this.speed = speed;
        this.syncSpeedToEntity();
    }

    public hasSource(): boolean {
        return this.source !== null;
    }

    public setSource(source: Vector3 | null): void {
        this.source = source;
    }

    public removeSource(): void {
        this.setSpeed(0);
        this.setSource(null);
        if (this.hasNetwork()) {
            this.getOrCreateNetwork().remove(this);
        }
    }

    public updateFromNetwork(maxStress: number, currentStress: number, networkSize: number): void {
        this.networkDirty = false;
        this.capacity = maxStress;
        this.stress = currentStress;

        const overStressed = maxStress < currentStress;

        if (overStressed !== this.overStressed) {
            const prevSpeed = this.getSpeed();
            this.overStressed = overStressed;
            this.onSpeedChanged(prevSpeed);
        }
    }

    public onSpeedChanged(previousSpeed: number): void {
        this.syncSpeedToEntity();
    }

    protected syncSpeedToEntity(): void {}

    // --- Render / Visual Bridge ---

    public needsVisualEntity(): boolean {
        return false;
    }

    public getVisualEntityId(): string | undefined {
        return undefined;
    }
}
