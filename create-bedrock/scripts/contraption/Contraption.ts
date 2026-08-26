import { Vector3, Transform } from "../utilities/Math";
import { Block, Entity, Location } from "../core/BedrockAdapter";

export interface VirtualBlock {
    typeId: string;
    localPos: Vector3;
    states: any;
}

/**
 * Contraption Engine Core
 * Handles block snapshots and their transformation as moving structures.
 */
export class Contraption {
    public id: string;
    public transform: Transform;
    public blocks: VirtualBlock[] = [];
    public entities: Entity[] = [];

    // The pivot point around which rotation happens (in local space)
    public localPivot: Vector3 = new Vector3(0, 0, 0);

    constructor(id: string) {
        this.id = id;
        this.transform = new Transform();
    }

    /**
     * Snapshots a volume of blocks in the world into the contraption structure.
     */
    public assemble(origin: Location, blocksToInclude: Location[]): void {
        this.transform.position = new Vector3(origin.x, origin.y, origin.z);
        // Note: Real implementation would pull blocks from Bedrock dimension and convert to VirtualBlock.
        // It would also remove the blocks from the world (set to air) during movement.
    }

    /**
     * Converts the virtual structure back into physical blocks in the world.
     */
    public disassemble(): void {
        // Calculate world coordinates for each VirtualBlock using this.transform
        // Place blocks in the dimension, then clear this object.
    }

    /**
     * Update position/rotation in the simulation
     */
    public tickMovement(deltaTime: number, speed: number, rotationAxis: Vector3) {
        // e.g., apply rotation based on speed and axis
        // this.transform.rotation = calculateNewRotation(speed * deltaTime);
    }

    /**
     * Get the world position of a specific virtual block.
     */
    public getBlockWorldPosition(block: VirtualBlock): Vector3 {
        // Apply pivot offset, then rotation, then translation
        let offsetPos = block.localPos.subtract(this.localPivot);
        return this.transform.transformPoint(offsetPos);
    }
}
