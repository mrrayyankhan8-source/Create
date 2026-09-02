import { Entity, Vector3, Dimension } from "@minecraft/server";
import { Contraption } from "./Contraption.js";

/**
 * Port of com.simibubi.create.content.contraptions.AbstractContraptionEntity
 * In Bedrock, we use an invisible dummy entity or rideable seat entity as the anchor
 * which moves the associated `Contraption` data payload smoothly across the world.
 */
export abstract class AbstractContraptionEntity {
    public entity: Entity;
    public contraption: Contraption | null = null;
    public initialized: boolean = false;
    public stalled: boolean = false;

    // Bedrock specific tracking
    public prevPos: Vector3;

    constructor(entity: Entity) {
        this.entity = entity;
        this.prevPos = entity.location;
    }

    public tick(): void {
        if (!this.entity || !this.entity.isValid()) return;

        if (!this.initialized) {
            this.initialized = true;
            // Initialization logic (e.g. syncing payload to clients via dummy rendering)
        }

        if (this.contraption && !this.stalled) {
            this.contraption.tick();
        }

        this.prevPos = this.entity.location;
    }

    public disassemble(): void {
        if (!this.entity || !this.entity.isValid() || !this.contraption) return;

        // Stop moving
        this.contraption.stop();

        // Place blocks back into the world
        this.contraption.addBlocksToWorld(this.entity.dimension, this.entity.location);

        // Despawn the anchor
        this.entity.remove();
    }
}
