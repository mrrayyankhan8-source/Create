import { BaseKineticNode } from "../kinetic/KineticNode";
import { MachineState, Inventory } from "./MechanicalPress";

export class Mixer extends BaseKineticNode {
    public state: MachineState = MachineState.IDLE;
    public progress: number = 0;

    private inventoryBeneath: Inventory | null = null;
    public minimumSpeed: number = 32;

    constructor(id: string) {
        super(id);
    }

    getStressImpact(): number {
        return 4;
    }

    public setInventoryBeneath(inventory: Inventory) {
        this.inventoryBeneath = inventory;
    }

    public tick(deltaTime: number) {
        const speedMagnitude = Math.abs(this.speed);

        // Mixer requires a minimum speed to operate
        if (speedMagnitude < this.minimumSpeed) {
            this.state = MachineState.IDLE;
            this.progress = 0;
            return;
        }

        const step = speedMagnitude * deltaTime * 0.02;

        switch (this.state) {
            case MachineState.IDLE:
                if (this.inventoryBeneath && this.inventoryBeneath.items.length >= 2) {
                    // Very simple mock recipe: 2 items = mixed item
                    this.state = MachineState.PRESSING; // Using PRESSING state as "MIXING"
                    this.progress = 0;
                }
                break;

            case MachineState.PRESSING: // MIXING
                this.progress += step;
                if (this.progress >= 1.0) {
                    if (this.inventoryBeneath && this.inventoryBeneath.items.length >= 2) {
                        this.inventoryBeneath.items.shift();
                        this.inventoryBeneath.items.shift();
                        this.inventoryBeneath.items.push("mixed_result");
                    }
                    this.state = MachineState.IDLE;
                    this.progress = 0;
                }
                break;
        }
    }
}
