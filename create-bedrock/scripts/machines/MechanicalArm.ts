import { BaseKineticNode } from "../kinetic/KineticNode";
import { Inventory } from "./MechanicalPress";

export class MechanicalArm extends BaseKineticNode {

    public sourceInventory: Inventory | null = null;
    public targetInventory: Inventory | null = null;

    public carriedItem: string | null = null;
    public angle: number = 0;
    private targetAngle: number = 0;

    constructor(id: string) {
        super(id);
    }

    getStressImpact(): number {
        return 2;
    }

    public setInventories(source: Inventory, target: Inventory) {
        this.sourceInventory = source;
        this.targetInventory = target;
    }

    public tick(deltaTime: number) {
        if (this.speed === 0 || !this.sourceInventory || !this.targetInventory) return;

        const speedMagnitude = Math.abs(this.speed);
        const rotationStep = speedMagnitude * deltaTime; // degrees per second approximation

        // Simplified state:
        // Angle 0 = Source. Angle 180 = Target.

        if (this.carriedItem === null) {
            this.targetAngle = 0;
            if (Math.abs(this.angle - this.targetAngle) < rotationStep) {
                this.angle = this.targetAngle;
                // Try pickup
                if (this.sourceInventory.items.length > 0) {
                    this.carriedItem = this.sourceInventory.items.shift() || null;
                }
            } else {
                this.angle += (this.angle < this.targetAngle) ? rotationStep : -rotationStep;
            }
        } else {
            this.targetAngle = 180;
            if (Math.abs(this.angle - this.targetAngle) < rotationStep) {
                this.angle = this.targetAngle;
                // Try drop
                this.targetInventory.items.push(this.carriedItem);
                this.carriedItem = null;
            } else {
                this.angle += (this.angle < this.targetAngle) ? rotationStep : -rotationStep;
            }
        }
    }
}
