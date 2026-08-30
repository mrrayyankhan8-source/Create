import { Block } from "@minecraft/server";
import { RotatedPillarKineticBlockEntity } from "./RotatedPillarKineticBlockEntity.js";

/**
 * Port of com.simibubi.create.content.kinetics.simpleRelays.encased.EncasedShaftBlock
 * In Java this just uses KineticBlockEntity, but we'll use RotatedPillarKineticBlockEntity
 * for axis logic, and hook up the visual entity.
 */
export class EncasedShaftBlockEntity extends RotatedPillarKineticBlockEntity {

    public override needsVisualEntity(): boolean {
        // Bedrock block geometry will render the casing, and we spawn the rotating shaft visual inside it
        return true;
    }

    public override getVisualEntityId(): string | undefined {
        return "create:shaft_visual"; // Uses standard shaft visual, since the casing is static block geometry
    }
}
