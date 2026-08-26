import { Vector3 } from "../utilities/Math";
import { Location } from "../core/BedrockAdapter";
import { Contraption } from "../contraption/Contraption";

export class Train {
    public id: string;
    public name: string;

    // Train logic and physics representation
    public carriages: Contraption[] = [];
    public speed: number = 0;
    public maxSpeed: number = 0.5; // Blocks per tick
    public acceleration: number = 0.01;

    // Track position graph logic
    public currentNodeId: string | null = null;
    public distanceToNextNode: number = 0;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }

    public tick(deltaTime: number) {
        if (this.speed > 0) {
            // Traverse track graph
            // Update carriage transforms along the spline
        }
    }

    public assemble(origin: Location, carriageBlocks: Location[][]) {
        // Build carriage contraptions from world blocks
    }
}
