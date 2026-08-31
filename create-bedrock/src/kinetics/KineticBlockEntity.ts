import { Block, Dimension, Vector3 } from "@minecraft/server";

export class KineticBlockEntity {
    public dimension: Dimension;
    public block: Block;
    public networkDirty: boolean = false;
    private valid: boolean = true;
    public source: Vector3 | undefined;
    private speed: number = 0;

    constructor(block: Block) {
        this.block = block;
        this.dimension = block.dimension;
    }

    public isValid(): boolean {
        return this.valid;
    }

    public setInvalid(): void {
        this.valid = false;
    }

    public isSource(): boolean {
        return false;
    }

    public getGeneratedSpeed(): number {
        return 0;
    }

    public getTheoreticalSpeed(): number {
        return this.speed;
    }

    public setSpeed(speed: number): void {
        this.speed = speed;
    }

    public hasSource(): boolean {
        return this.source !== undefined;
    }

    public setSource(source: Vector3): void {
        this.source = source;
    }

    public removeSource(): void {
        this.source = undefined;
    }

    public calculateAddedStressCapacity(): number {
        return 0;
    }

    public calculateStressApplied(): number {
        return 0;
    }

    public updateFromNetwork(maxStress: number, currentStress: number, networkSize: number): void {
        // Overridden by subclasses
    }
}
