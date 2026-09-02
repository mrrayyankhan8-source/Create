import { Block } from "@minecraft/server";
import { KineticBlockEntity } from "./KineticBlockEntity.js";

/**
 * Port of com.simibubi.create.content.kinetics.crusher.CrushingWheelBlockEntity
 */
export class CrushingWheelBlockEntity extends KineticBlockEntity {

    public override onSpeedChanged(previousSpeed: number): void {
        super.onSpeedChanged(previousSpeed);
        this.fixControllers();
    }

    private fixControllers(): void {
        // In Java, this scans adjacencies to see if another wheel exists,
        // and if they rotate in opposite directions, it spawns an invisible CrushingWheelControllerBlock.
        // We will stub this controller registration here.
    }

    public override needsVisualEntity(): boolean {
        // Models are usually handled by Bedrock block rendering natively, but since Crushing Wheels
        // spin on arbitrary axes dynamically, we might need dummy entities if geometry is complex.
        return true;
    }

    public override getVisualEntityId(): string | undefined {
        return "create:crushing_wheel_visual";
    }
}
