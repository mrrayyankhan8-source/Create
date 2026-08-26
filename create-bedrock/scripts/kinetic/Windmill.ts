import { KineticNode } from "./KineticNode";
import { Location } from "../core/BedrockAdapter";

export class Windmill implements KineticNode {
    id: string;
    location: Location;
    networkId?: number;

    public isSource: boolean = true;

    // Amount of wool/sail blocks attached
    private sailCount: number = 0;

    private generatedSpeed: number = 0;
    private generatedCapacity: number = 0;

    constructor(id: string, location: Location) {
        this.id = id;
        this.location = location;
    }

    public updateSailConfiguration(sailCount: number) {
        this.sailCount = sailCount;

        if (this.sailCount >= 8) {
            // Formula approximate to Create Mod: speed and capacity scale with sails
            this.generatedSpeed = Math.min(16, Math.floor(this.sailCount / 8));
            this.generatedCapacity = this.sailCount * 32;
        } else {
            this.generatedSpeed = 0;
            this.generatedCapacity = 0;
        }
    }

    getGeneratedSpeed(): number {
        return this.generatedSpeed;
    }

    getTheoreticalSpeed(): number {
        return this.generatedSpeed;
    }

    calculateAddedStressCapacity(): number {
        return this.generatedCapacity;
    }

    calculateStressApplied(): number {
        return 0;
    }

    updateFromNetwork(capacity: number, stress: number, size: number): void {
    }
}
