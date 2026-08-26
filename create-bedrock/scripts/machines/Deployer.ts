import { KineticNode } from "../kinetic/KineticNode";
import { Location } from "../core/BedrockAdapter";

export enum DeployerAction {
    PLACE,
    USE,
    ATTACK,
    BREAK,
    INTERACT
}

export class Deployer implements KineticNode {
    id: string;
    location: Location;
    networkId?: number;

    public isSource: boolean = false;
    private currentSpeed: number = 0;
    public stressImpact: number = 4;

    public currentAction: DeployerAction = DeployerAction.USE;
    private progress: number = 0;
    private isExtending: boolean = false;

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
        if (this.currentSpeed === 0) return;

        const step = Math.abs(this.currentSpeed) * deltaTime * 0.05;

        if (this.isExtending) {
            this.progress += step;
            if (this.progress >= 1.0) {
                this.performAction();
                this.isExtending = false;
            }
        } else {
            this.progress -= step;
            if (this.progress <= 0) {
                this.progress = 0;
                // Await next trigger or continue loop
            }
        }
    }

    private performAction() {
        // Implement virtual player hand simulation based on currentAction
    }
}
