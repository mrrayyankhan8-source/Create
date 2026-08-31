import { Dimension, Block } from "@minecraft/server";
import { KineticBlockEntity } from "./KineticBlockEntity.js";

// TorquePropagator placeholder - to be implemented
export class TorquePropagator {
    static networks: Map<string, Map<number, KineticNetwork>> = new Map();
}

export class KineticNetwork {
    public id: number;
    public initialized: boolean = false;
    public sources: Map<KineticBlockEntity, number>;
    public members: Map<KineticBlockEntity, number>;

    private currentCapacity: number = 0;
    private currentStress: number = 0;
    private unloadedCapacity: number = 0;
    private unloadedStress: number = 0;
    private unloadedMembers: number = 0;

    constructor(id: number) {
        this.id = id;
        this.sources = new Map();
        this.members = new Map();
    }

    public initFromTE(maxStress: number, currentStress: number, membersCount: number): void {
        this.unloadedCapacity = maxStress;
        this.unloadedStress = currentStress;
        this.unloadedMembers = membersCount;
        this.initialized = true;
        this.updateStress();
        this.updateCapacity();
    }

    public addSilently(be: KineticBlockEntity, lastCapacity: number, lastStress: number): void {
        if (this.members.has(be)) return;

        if (be.isSource()) {
            this.unloadedCapacity -= lastCapacity * KineticNetwork.getStressMultiplierForSpeed(be.getGeneratedSpeed());
            const addedStressCapacity = be.calculateAddedStressCapacity();
            this.sources.set(be, addedStressCapacity);
        }

        this.unloadedStress -= lastStress * KineticNetwork.getStressMultiplierForSpeed(be.getTheoreticalSpeed());
        const stressApplied = be.calculateStressApplied();
        this.members.set(be, stressApplied);

        this.unloadedMembers--;
        if (this.unloadedMembers < 0) this.unloadedMembers = 0;
        if (this.unloadedCapacity < 0) this.unloadedCapacity = 0;
        if (this.unloadedStress < 0) this.unloadedStress = 0;
    }

    public add(be: KineticBlockEntity): void {
        if (this.members.has(be)) return;

        if (be.isSource()) {
            this.sources.set(be, be.calculateAddedStressCapacity());
        }

        this.members.set(be, be.calculateStressApplied());
        this.updateFromNetwork(be);
        be.networkDirty = true;
    }

    public updateCapacityFor(be: KineticBlockEntity, capacity: number): void {
        this.sources.set(be, capacity);
        this.updateCapacity();
    }

    public updateStressFor(be: KineticBlockEntity, stress: number): void {
        this.members.set(be, stress);
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
            const dimNetworks = TorquePropagator.networks.get(be.dimension.id);
            if (dimNetworks) {
                dimNetworks.delete(this.id);
            }
            return;
        }

        const firstMember = Array.from(this.members.keys())[0];
        if (firstMember) {
            firstMember.networkDirty = true;
        }
    }

    public sync(): void {
        for (const be of this.members.keys()) {
            this.updateFromNetwork(be);
        }
    }

    private updateFromNetwork(be: KineticBlockEntity): void {
        be.updateFromNetwork(this.currentCapacity, this.currentStress, this.getSize());
    }

    public updateCapacity(): void {
        const newMaxStress = this.calculateCapacity();
        if (this.currentCapacity !== newMaxStress) {
            this.currentCapacity = newMaxStress;
            this.sync();
        }
    }

    public updateStress(): void {
        const newStress = this.calculateStress();
        if (this.currentStress !== newStress) {
            this.currentStress = newStress;
            this.sync();
        }
    }

    public updateNetwork(): void {
        const newStress = this.calculateStress();
        const newMaxStress = this.calculateCapacity();
        if (this.currentStress !== newStress || this.currentCapacity !== newMaxStress) {
            this.currentStress = newStress;
            this.currentCapacity = newMaxStress;
            this.sync();
        }
    }

    public calculateCapacity(): number {
        let presentCapacity = 0;
        for (const be of Array.from(this.sources.keys())) {
            if (!be.isValid()) {
                this.sources.delete(be);
                continue;
            }
            presentCapacity += this.getActualCapacityOf(be);
        }
        return presentCapacity + this.unloadedCapacity;
    }

    public calculateStress(): number {
        let presentStress = 0;
        for (const be of Array.from(this.members.keys())) {
            if (!be.isValid()) {
                this.members.delete(be);
                continue;
            }
            presentStress += this.getActualStressOf(be);
        }
        return presentStress + this.unloadedStress;
    }

    public getActualCapacityOf(be: KineticBlockEntity): number {
        const sourceVal = this.sources.get(be) ?? 0;
        return sourceVal * KineticNetwork.getStressMultiplierForSpeed(be.getGeneratedSpeed());
    }

    public getActualStressOf(be: KineticBlockEntity): number {
        const memberVal = this.members.get(be) ?? 0;
        return memberVal * KineticNetwork.getStressMultiplierForSpeed(be.getTheoreticalSpeed());
    }

    private static getStressMultiplierForSpeed(speed: number): number {
        return Math.abs(speed);
    }

    public getSize(): number {
        return this.unloadedMembers + this.members.size;
    }
}
