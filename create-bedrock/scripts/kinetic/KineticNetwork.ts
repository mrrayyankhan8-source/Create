import { KineticNode } from "./KineticNode";

export class KineticNetwork {
    public id: number;
    public initialized: boolean = false;

    public sources: Map<KineticNode, number> = new Map();
    public members: Map<KineticNode, number> = new Map();

    private currentCapacity: number = 0;
    private currentStress: number = 0;
    private unloadedCapacity: number = 0;
    private unloadedStress: number = 0;
    private unloadedMembers: number = 0;

    constructor(id: number) {
        this.id = id;
    }

    public init(maxStress: number, currentStress: number, membersCount: number) {
        this.unloadedCapacity = maxStress;
        this.unloadedStress = currentStress;
        this.unloadedMembers = membersCount;
        this.initialized = true;
        this.updateStress();
        this.updateCapacity();
    }

    public add(node: KineticNode) {
        if (this.members.has(node)) return;

        if (node.isSource) {
            this.sources.set(node, node.calculateAddedStressCapacity());
        }

        this.members.set(node, node.calculateStressApplied());
        this.updateFromNetwork(node);
        // node.networkDirty = true;
    }

    public remove(node: KineticNode) {
        if (!this.members.has(node)) return;

        if (node.isSource) {
            this.sources.delete(node);
        }
        this.members.delete(node);

        node.updateFromNetwork(0, 0, 0);

        if (this.members.size === 0) {
            // Signal external manager to remove this network instance
        }
    }

    public sync() {
        for (const node of this.members.keys()) {
            this.updateFromNetwork(node);
        }
    }

    private updateFromNetwork(node: KineticNode) {
        node.updateFromNetwork(this.currentCapacity, this.currentStress, this.getSize());
    }

    public updateCapacity() {
        const newCapacity = this.calculateCapacity();
        if (this.currentCapacity !== newCapacity) {
            this.currentCapacity = newCapacity;
            this.sync();
        }
    }

    public updateStress() {
        const newStress = this.calculateStress();
        if (this.currentStress !== newStress) {
            this.currentStress = newStress;
            this.sync();
        }
    }

    public calculateCapacity(): number {
        let presentCapacity = 0;
        for (const [node, capacity] of this.sources.entries()) {
            // Check if node is still valid (stub)
            presentCapacity += this.getActualCapacityOf(node, capacity);
        }
        return presentCapacity + this.unloadedCapacity;
    }

    public calculateStress(): number {
        let presentStress = 0;
        for (const [node, stress] of this.members.entries()) {
            // Check if node is still valid (stub)
            presentStress += this.getActualStressOf(node, stress);
        }
        return presentStress + this.unloadedStress;
    }

    private getActualCapacityOf(node: KineticNode, capacity: number): number {
        return capacity * this.getStressMultiplierForSpeed(node.getGeneratedSpeed());
    }

    private getActualStressOf(node: KineticNode, stress: number): number {
        return stress * this.getStressMultiplierForSpeed(node.getTheoreticalSpeed());
    }

    private getStressMultiplierForSpeed(speed: number): number {
        return Math.abs(speed);
    }

    public getSize(): number {
        return this.unloadedMembers + this.members.size;
    }
}
