import { IKineticBlockEntity } from "./types";

export class KineticNetwork {
    public id: string;
    public initialized: boolean = false;
    public sources: Map<IKineticBlockEntity, number>;
    public members: Map<IKineticBlockEntity, number>;

    public currentCapacity: number = 0;
    public currentStress: number = 0;
    public unloadedCapacity: number = 0;
    public unloadedStress: number = 0;
    public unloadedMembers: number = 0;

    constructor(id: string) {
        this.id = id;
        this.sources = new Map();
        this.members = new Map();
    }

    public initFromTE(maxStress: number, currentStress: number, members: number): void {
        this.unloadedCapacity = maxStress;
        this.unloadedStress = currentStress;
        this.unloadedMembers = members;
        this.initialized = true;
        this.updateStress();
        this.updateCapacity();
    }

    public addSilently(be: IKineticBlockEntity, lastCapacity: number, lastStress: number): void {
        if (this.members.has(be)) return;
        if (be.isSource()) {
            this.unloadedCapacity -= lastCapacity * this.getStressMultiplierForSpeed(be.getGeneratedSpeed());
            const addedStressCapacity = be.calculateAddedStressCapacity();
            this.sources.set(be, addedStressCapacity);
        }

        this.unloadedStress -= lastStress * this.getStressMultiplierForSpeed(be.getTheoreticalSpeed());
        const stressApplied = be.calculateStressApplied();
        this.members.set(be, stressApplied);

        this.unloadedMembers--;
        if (this.unloadedMembers < 0) this.unloadedMembers = 0;
        if (this.unloadedCapacity < 0) this.unloadedCapacity = 0;
        if (this.unloadedStress < 0) this.unloadedStress = 0;
        this.updateCapacity();
        this.updateStress();
    }

    public add(be: IKineticBlockEntity): void {
        if (this.members.has(be)) return;
        if (be.isSource()) {
            this.sources.set(be, be.calculateAddedStressCapacity());
        }
        this.members.set(be, be.calculateStressApplied());
        this.updateCapacity();
        this.updateStress();
        this.updateFromNetwork(be);
        be.networkDirty = true;
    }

    public updateCapacityFor(be: IKineticBlockEntity, capacity: number): void {
        this.sources.set(be, capacity);
        this.updateCapacity();
    }

    public updateStressFor(be: IKineticBlockEntity, stress: number): void {
        this.members.set(be, stress);
        this.updateStress();
    }

    public remove(be: IKineticBlockEntity): void {
        if (!this.members.has(be)) return;
        if (be.isSource()) {
            this.sources.delete(be);
        }
        this.members.delete(be);
        be.updateFromNetwork(0, 0, 0);
        this.updateCapacity();
        this.updateStress();

        if (this.members.size === 0) {
            // Need a registry in manager to properly remove, but we'll handle this in the manager.
            return;
        }

        const firstMember = this.members.keys().next().value;
        if (firstMember) {
            firstMember.networkDirty = true;
        }
    }

    public sync(): void {
        this.updateCapacity();
        this.updateStress();
        for (const be of this.members.keys()) {
            this.updateFromNetwork(be);
        }
    }

    private updateStress(): void {
        this.currentStress = this.unloadedStress;
        for (const stress of this.members.values()) {
            this.currentStress += stress;
        }
    }

    private updateCapacity(): void {
        this.currentCapacity = this.unloadedCapacity;
        for (const capacity of this.sources.values()) {
            this.currentCapacity += capacity;
        }
    }

    private updateFromNetwork(be: IKineticBlockEntity): void {
        be.updateFromNetwork(this.currentCapacity, this.currentStress, this.getSize());
    }

    public getSize(): number {
        return this.unloadedMembers + this.members.size;
    }

    private getStressMultiplierForSpeed(speed: number): number {
        // Simple multiplier for now, Java Create does Math.abs(speed)
        return Math.abs(speed);
    }
}
