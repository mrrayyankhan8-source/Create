import { Block, BlockPermutation, Dimension, Vector3 } from "@minecraft/server";
import { KineticBlockEntity } from "../block/KineticBlockEntity.js";

/**
 * Port of com.simibubi.create.content.kinetics.KineticNetwork
 */
export class KineticNetwork {
    public id: number;
    public initialized: boolean = false;
    public sources: Map<KineticBlockEntity, number> = new Map();
    public members: Map<KineticBlockEntity, number> = new Map();

    private currentCapacity: number = 0;
    private currentStress: number = 0;

    constructor(id: number) {
        this.id = id;
    }

    public initFromTE(maxStress: number, currentStress: number): void {
        this.currentCapacity = maxStress;
        this.currentStress = currentStress;
        this.initialized = true;
        this.updateStress();
        this.updateCapacity();
    }

    public addSilently(be: KineticBlockEntity, lastCapacity: number, lastStress: number): void {
        if (this.members.has(be)) return;

        if (be.isSource()) {
            this.currentCapacity -= lastCapacity * this.getStressMultiplierForSpeed(be.getGeneratedSpeed());
            const addedStressCapacity = be.calculateAddedStressCapacity();
            this.sources.set(be, addedStressCapacity);
        }

        this.currentStress -= lastStress * this.getStressMultiplierForSpeed(be.getTheoreticalSpeed());
        const stressApplied = be.calculateStressApplied();
        this.members.set(be, stressApplied);
    }

    public add(be: KineticBlockEntity): void {
        if (this.members.has(be)) return;
        if (be.isSource()) {
            this.sources.set(be, be.calculateAddedStressCapacity());
            this.updateCapacity();
        }

        this.members.set(be, be.calculateStressApplied());
        this.updateStress();
    }

    public remove(be: KineticBlockEntity): void {
        if (!this.members.has(be)) return;
        if (be.isSource()) {
            this.sources.delete(be);
        }
        this.members.delete(be);

        if (this.members.size === 0) {
            // TorquePropagator handles full removal
        } else {
            this.updateCapacity();
            this.updateStress();
        }
    }

    public updateStress(): void {
        this.currentStress = 0;
        for (const [member, stressApplied] of this.members.entries()) {
            this.currentStress += stressApplied * this.getStressMultiplierForSpeed(member.getTheoreticalSpeed());
        }
        this.syncNetwork();
    }

    public updateCapacity(): void {
        this.currentCapacity = 0;
        for (const [source, capacityAdded] of this.sources.entries()) {
            this.currentCapacity += capacityAdded * this.getStressMultiplierForSpeed(source.getGeneratedSpeed());
        }
        this.syncNetwork();
    }

    private syncNetwork(): void {
        const overStressed = this.currentStress > this.currentCapacity;
        for (const member of this.members.keys()) {
            if (member.updateOverStressed(overStressed)) {
                member.updateSpeed();
            }
        }
    }

    private getStressMultiplierForSpeed(speed: number): number {
        return Math.abs(speed); // simplified logic from Create source
    }
}
