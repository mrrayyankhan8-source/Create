import { KineticBlockEntity } from "../block/KineticBlockEntity.js";
import { TorquePropagator } from "./TorquePropagator.js";

/**
 * Port of com.simibubi.create.content.kinetics.KineticNetwork
 */
export class KineticNetwork {
    public id: number;
    public dimensionId: string;
    public initialized: boolean = false;
    public sources: Map<KineticBlockEntity, number> = new Map();
    public members: Map<KineticBlockEntity, number> = new Map();

    private currentCapacity: number = 0;
    private currentStress: number = 0;

    constructor(id: number, dimensionId: string) {
        this.id = id;
        this.dimensionId = dimensionId;
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

        be.updateFromNetwork(0, 0, 0);

        if (this.members.size === 0) {
            TorquePropagator.removeNetwork(this.dimensionId, this.id);
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
            member.updateFromNetwork(this.currentCapacity, this.currentStress, this.members.size);
        }
    }

    private getStressMultiplierForSpeed(speed: number): number {
        return Math.abs(speed);
    }
}
