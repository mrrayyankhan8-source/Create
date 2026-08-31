import { Dimension, Vector3, Entity } from "@minecraft/server";
import { AbstractContraptionEntity } from "./AbstractContraptionEntity.js";

/**
 * Global registry tracking active contraptions in the world
 */
export class ContraptionManager {
    public static contraptions: Map<string, AbstractContraptionEntity> = new Map();

    public static register(id: string, ce: AbstractContraptionEntity): void {
        this.contraptions.set(id, ce);
    }

    public static tickAll(): void {
        for (const [id, ce] of this.contraptions.entries()) {
            if (!ce.entity || !ce.entity.isValid()) {
                this.contraptions.delete(id);
                continue;
            }
            ce.tick();
        }
    }
}
