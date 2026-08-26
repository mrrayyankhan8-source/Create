import { KineticNode } from "./KineticNode";
import { Location } from "../core/BedrockAdapter";

export class Gearbox implements KineticNode {
    id: string;
    location: Location;
    networkId?: number;

    public isSource: boolean = false;
    private currentSpeed: number = 0;

    // Axis propagation direction reversing
    public propagateReverse: boolean = true;

    constructor(id: string, location: Location) {
        this.id = id;
        this.location = location;
    }

    getGeneratedSpeed(): number { return 0; }
    getTheoreticalSpeed(): number { return this.currentSpeed; }
    calculateAddedStressCapacity(): number { return 0; }
    calculateStressApplied(): number { return 0; } // Assuming minimal intrinsic stress

    updateFromNetwork(capacity: number, stress: number, size: number): void {
        if (stress > capacity && capacity > 0) {
            this.currentSpeed = 0;
        }
    }

    public setSpeed(speed: number) {
        this.currentSpeed = speed;
    }
}
