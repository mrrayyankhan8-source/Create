import { KineticNode } from "./KineticNode";
import { Location } from "../core/BedrockAdapter";

export class Shaft implements KineticNode {
    id: string;
    location: Location;
    networkId?: number;

    public isSource: boolean = false;
    private currentSpeed: number = 0;
    private networkCapacity: number = 0;
    private networkStress: number = 0;

    constructor(id: string, location: Location) {
        this.id = id;
        this.location = location;
    }

    getGeneratedSpeed(): number {
        return 0; // Shafts don't generate speed
    }

    getTheoreticalSpeed(): number {
        return this.currentSpeed;
    }

    calculateAddedStressCapacity(): number {
        return 0; // Shafts don't add capacity
    }

    calculateStressApplied(): number {
        return 0; // Idle shafts generally don't add stress by themselves, or it's negligible.
    }

    updateFromNetwork(capacity: number, stress: number, size: number): void {
        this.networkCapacity = capacity;
        this.networkStress = stress;

        // If overloaded, stop turning
        if (stress > capacity && capacity > 0) {
            this.currentSpeed = 0;
        } else {
            // Speed logic is handled by network propagation; for now assume network passes speed directly to node
        }
    }

    public setSpeed(speed: number) {
        this.currentSpeed = speed;
    }
}
