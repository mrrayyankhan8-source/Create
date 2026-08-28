import { KineticBlockEntity } from "./KineticBlockEntity.js";

export class KineticNetwork {
    public id: string;
    public initialized: boolean = false;
    public sources: Map<KineticBlockEntity, number> = new Map();
    public members: Map<KineticBlockEntity, number> = new Map();

    private currentCapacity: number = 0;
    private currentStress: number = 0;

    constructor(id: string) {
        this.id = id;
    }

    public add(be: KineticBlockEntity) {
        if (this.members.has(be)) return;

        if (be.isSource()) {
            this.sources.set(be, be.calculateAddedStressCapacity());
        }
        this.members.set(be, be.calculateStressApplied());
        this.updateNetwork();
    }

    public remove(be: KineticBlockEntity) {
        if (!this.members.has(be)) return;

        if (be.isSource()) {
            this.sources.delete(be);
        }
        this.members.delete(be);
        be.updateFromNetwork(0, 0, 0);

        if (this.members.size === 0) {
            // Signal to TorquePropagator to remove this network
            // Handle this globally.
            return;
        }

        this.updateNetwork();
    }

    public updateNetwork() {
        const newStress = this.calculateStress();
        const newMaxStress = this.calculateCapacity();

        if (this.currentStress !== newStress || this.currentCapacity !== newMaxStress) {
            this.currentStress = newStress;
            this.currentCapacity = newMaxStress;
            this.sync();
        }
    }

    private sync() {
        for (const be of this.members.keys()) {
            be.updateFromNetwork(this.currentCapacity, this.currentStress, this.members.size);
        }
    }

    public calculateCapacity(): number {
        let presentCapacity = 0;
        for (const [be, capacity] of this.sources.entries()) {
            presentCapacity += capacity * Math.abs(be.getGeneratedSpeed());
        }
        return presentCapacity;
    }

    public calculateStress(): number {
        let presentStress = 0;
        for (const [be, stress] of this.members.entries()) {
            presentStress += stress * Math.abs(be.getTheoreticalSpeed());
        }
        return presentStress;
    }
}
