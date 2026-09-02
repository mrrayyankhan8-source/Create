import { SplitShaftBlockEntity } from "./SplitShaftBlockEntity.js";

/**
 * Port of com.simibubi.create.content.kinetics.transmission.ClutchBlockEntity
 */
export class ClutchBlockEntity extends SplitShaftBlockEntity {

    public override getRotationSpeedModifier(face: string): number {
        if (this.hasSource()) {
            if (face !== this.getSourceFacing() && this.isPowered()) {
                return 0.0;
            }
        }
        return 1.0;
    }

    private isPowered(): boolean {
        const powered = this.block.permutation.getState("create:powered" as any);
        return powered === true;
    }

    public override needsVisualEntity(): boolean {
        return true;
    }

    public override getVisualEntityId(): string | undefined {
        return "create:clutch_visual";
    }
}
