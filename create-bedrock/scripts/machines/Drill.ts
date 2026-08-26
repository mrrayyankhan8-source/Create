import { KineticNode } from "../kinetic/KineticNode";
import { Location } from "../core/BedrockAdapter";

export class Drill implements KineticNode {
    id: string;
    location: Location;
    networkId?: number;

    public isSource: boolean = false;
    private currentSpeed: number = 0;
    public stressImpact: number = 4;

    constructor(id: string, location: Location) {
        this.id = id;
        this.location = location;
    }

    getGeneratedSpeed(): number { return 0; }
    getTheoreticalSpeed(): number { return this.currentSpeed; }
    calculateAddedStressCapacity(): number { return 0; }
    calculateStressApplied(): number { return this.stressImpact; }

    updateFromNetwork(capacity: number, stress: number, size: number): void {
        if (stress > capacity && capacity > 0) {
            this.currentSpeed = 0;
        }
    }

    public setSpeed(speed: number) {
        this.currentSpeed = speed;
    }

    public tick(deltaTime: number) {
        if (this.currentSpeed !== 0) {
            // Check block in front of drill, apply mining progress based on speed
        }
    }
}
