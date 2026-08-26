import { BaseKineticNode } from "../kinetic/KineticNode";

export enum MachineState {
    IDLE,
    EXTENDING,
    PRESSING,
    RETRACTING
}

export interface Inventory {
    items: string[];
}

export class MechanicalPress extends BaseKineticNode {

    public state: MachineState = MachineState.IDLE;
    public progress: number = 0;

    private inventoryBeneath: Inventory | null = null;

    constructor(id: string) {
        super(id);
    }

    getStressImpact(): number {
        return 8; // Press requires 8 units of capacity per RPM
    }

    public setInventoryBeneath(inventory: Inventory) {
        this.inventoryBeneath = inventory;
    }

    public tick(deltaTime: number) {
        if (this.speed === 0) return;

        // Speed dictates processing rate.
        // 1 RPM = 1 progress unit per second roughly.
        const speedMagnitude = Math.abs(this.speed);
        const step = speedMagnitude * deltaTime * 0.05;

        switch (this.state) {
            case MachineState.IDLE:
                // Check if there is something to press
                if (this.inventoryBeneath && this.inventoryBeneath.items.length > 0) {
                    // For the sake of the virtual backend, if there's an item, we try to press it.
                    // Real implementation involves recipe lookups.
                    if (this.inventoryBeneath.items.includes("iron_ingot")) {
                        this.state = MachineState.EXTENDING;
                        this.progress = 0;
                    }
                }
                break;

            case MachineState.EXTENDING:
                this.progress += step;
                if (this.progress >= 1.0) {
                    this.state = MachineState.PRESSING;
                    this.progress = 1.0;
                }
                break;

            case MachineState.PRESSING:
                if (this.inventoryBeneath) {
                    const index = this.inventoryBeneath.items.indexOf("iron_ingot");
                    if (index !== -1) {
                        this.inventoryBeneath.items[index] = "iron_sheet";
                    }
                }
                this.state = MachineState.RETRACTING;
                break;

            case MachineState.RETRACTING:
                this.progress -= step;
                if (this.progress <= 0) {
                    this.state = MachineState.IDLE;
                    this.progress = 0;
                }
                break;
        }
    }
}
