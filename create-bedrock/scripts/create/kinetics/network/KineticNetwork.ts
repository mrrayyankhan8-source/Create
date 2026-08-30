import { Block, BlockPermutation, Dimension, Vector3 } from "@minecraft/server";
import { KineticBlockEntity } from "../block/KineticBlockEntity.js";

/**
 * Port of com.simibubi.create.content.kinetics.KineticNetwork
 * Simulates a kinetic network independent of standard Minecraft ticking.
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

    public updateStress(): void {
        // Recalculate network stress based on members
        this.currentStress = 0;
        for (const [member, _] of this.members.entries()) {
            this.currentStress += member.calculateStressApplied();
        }
        this.syncNetwork();
    }

    public updateCapacity(): void {
        this.currentCapacity = 0;
        for (const [source, _] of this.sources.entries()) {
            this.currentCapacity += source.calculateAddedStressCapacity();
        }
        this.syncNetwork();
    }

    private syncNetwork(): void {
        const overStressed = this.currentStress > this.currentCapacity;
        for (const member of this.members.keys()) {
            if (member.updateOverStressed(overStressed)) {
                // If state changed, update its speed/effects
                member.updateSpeed();
            }
        }
    }

    private getStressMultiplierForSpeed(speed: number): number {
        return Math.abs(speed); // simplified logic from Create source
    }
}
