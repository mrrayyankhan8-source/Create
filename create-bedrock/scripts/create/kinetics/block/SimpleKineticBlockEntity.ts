import { Block, Vector3 } from "@minecraft/server";
import { KineticBlockEntity } from "./KineticBlockEntity.js";

/**
 * Port of com.simibubi.create.content.kinetics.simpleRelays.SimpleKineticBlockEntity
 */
export class SimpleKineticBlockEntity extends KineticBlockEntity {
    public isSource(): boolean {
        return false;
    }
}
