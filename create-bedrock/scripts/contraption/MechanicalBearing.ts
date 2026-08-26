import { KineticNode } from "../kinetic/KineticNode";
import { Location } from "../core/BedrockAdapter";
import { Contraption } from "./Contraption";

export class MechanicalBearing implements KineticNode {
    id: string;
    location: Location;
    networkId?: number;

    public isSource: boolean = false;
    private currentSpeed: number = 0;
    public stressImpact: number = 0; // Bearings might impart stress based on attached contraption mass

    public attachedContraption: Contraption | null = null;
    public angle: number = 0;

    constructor(id: string, location: Location) {
        this.id = id;
        this.location = location;
    }

    getGeneratedSpeed(): number { return 0; }
    getTheoreticalSpeed(): number { return this.currentSpeed; }
    calculateAddedStressCapacity(): number { return 0; }

    calculateStressApplied(): number {
        if (this.attachedContraption) {
            // e.g. mass of contraption blocks
            return this.attachedContraption.blocks.length * 1.5;
        }
        return this.stressImpact;
    }

    updateFromNetwork(capacity: number, stress: number, size: number): void {
        if (stress > capacity && capacity > 0) {
            this.currentSpeed = 0;
        }
    }

    public setSpeed(speed: number) {
        this.currentSpeed = speed;
    }

    public tick(deltaTime: number) {
        if (!this.attachedContraption) return;

        if (this.currentSpeed !== 0) {
            // Update visual angle
            this.angle += this.currentSpeed * deltaTime;

            // Pass movement down to contraption
            // Assuming bearing rotates on the Y axis for this example
            // this.attachedContraption.tickMovement(...)
        }
    }

    public assemble() {
        if (this.attachedContraption) return;
        this.attachedContraption = new Contraption(`${this.id}_contraption`);
        // Trigger structure search and assembly logic
    }

    public disassemble() {
        if (!this.attachedContraption) return;
        // Check if bearing is close enough to grid snap point (angle % 90 == 0 roughly)
        this.attachedContraption.disassemble();
        this.attachedContraption = null;
    }
}
