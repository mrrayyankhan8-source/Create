import { KineticNetwork } from "./KineticNetwork";

export interface KineticNode {
    id: string;

    isSource: boolean;

    // The speed the node is trying to generate (if it's a source)
    getGeneratedSpeed(): number;

    // The capacity the node provides per RPM (if it's a source)
    getGeneratedCapacity(): number;

    // The stress impact the node applies per RPM
    getStressImpact(): number;

    setNetwork(network: KineticNetwork | null): void;
    getNetwork(): KineticNetwork | null;

    // Set by the network solver (0 if overstressed or disconnected)
    setSpeed(speed: number): void;
    getSpeed(): number;

    // Set by the network solver (the speed without considering stress limits)
    setTheoreticalSpeed(speed: number): void;
    getTheoreticalSpeed(): number;

    // Called when the network state changes
    updateFromNetwork(capacity: number, stress: number, overstressed: boolean): void;
}

export abstract class BaseKineticNode implements KineticNode {
    public id: string;
    public isSource: boolean = false;

    protected network: KineticNetwork | null = null;
    protected speed: number = 0;
    protected theoreticalSpeed: number = 0;

    constructor(id: string) {
        this.id = id;
    }

    getGeneratedSpeed(): number { return 0; }
    getGeneratedCapacity(): number { return 0; }
    getStressImpact(): number { return 0; }

    setNetwork(network: KineticNetwork | null): void {
        this.network = network;
    }

    getNetwork(): KineticNetwork | null {
        return this.network;
    }

    setSpeed(speed: number): void {
        this.speed = speed;
    }

    getSpeed(): number {
        return this.speed;
    }

    setTheoreticalSpeed(speed: number): void {
        this.theoreticalSpeed = speed;
    }

    getTheoreticalSpeed(): number {
        return this.theoreticalSpeed;
    }

    updateFromNetwork(capacity: number, stress: number, overstressed: boolean): void {
        // Can be overridden by subclasses
    }
}
