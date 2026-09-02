import { Block } from "@minecraft/server";
import { KineticBlockEntity } from "./KineticBlockEntity.js";

/**
 * Port of com.simibubi.create.content.kinetics.base.GeneratingKineticBlockEntity
 */
export abstract class GeneratingKineticBlockEntity extends KineticBlockEntity {
    public reActivateSource: boolean = false;

    public isSource(): boolean {
        return true;
    }

    public removeSource(): void {
        if (this.hasSource() && this.isSource()) {
            this.reActivateSource = true;
        }
        super.removeSource();
    }

    public setSource(source: import("@minecraft/server").Vector3 | null): void {
        super.setSource(source);
        // Additional Java behavior here: lookup source block entity and trigger reActivateSource
    }
}
