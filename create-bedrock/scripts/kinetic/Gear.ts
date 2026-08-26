import { KineticNode } from "./KineticNode";
import { Location } from "../core/BedrockAdapter";

export class Gear implements KineticNode {
    id: string;
    location: Location;
    networkId?: number;

    public isLarge: boolean;
    public isSource: boolean = false;
    private currentSpeed: number = 0;
    private networkCapacity: number = 0;
    private networkStress: number = 0;

    constructor(id: string, location: Location, isLarge: boolean = false) {
        this.id = id;
        this.location = location;
        this.isLarge = isLarge;
    }

    getGeneratedSpeed(): number {
        return 0;
    }

    getTheoreticalSpeed(): number {
        return this.currentSpeed;
    }

    calculateAddedStressCapacity(): number {
        return 0;
    }

    calculateStressApplied(): number {
        return 0;
    }

    updateFromNetwork(capacity: number, stress: number, size: number): void {
        this.networkCapacity = capacity;
        this.networkStress = stress;
        if (stress > capacity && capacity > 0) {
            this.currentSpeed = 0;
        }
    }

    public setSpeed(speed: number) {
        this.currentSpeed = speed;
    }

    public getTeethCount(): number {
        return this.isLarge ? 16 : 8; // Simplified representation
    }

    /**
     * Calculates the output speed when meshed with another gear.
     */
    public calculateMeshedSpeed(inputSpeed: number, inputTeeth: number): number {
        const outputTeeth = this.getTeethCount();
        return -(inputSpeed * inputTeeth) / outputTeeth; // Opposite direction
    }
}
