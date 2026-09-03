import { BlockCustomComponent, BlockComponentPlayerInteractEvent } from "@minecraft/server";
import { AnalogLeverBlockEntity } from "./AnalogLeverBlockEntity.js";

/**
 * Native Bedrock custom component for Analog Lever interactions
 */
export class AnalogLeverComponent implements BlockCustomComponent {
    public onPlayerInteract(event: BlockComponentPlayerInteractEvent): void {
        const be = new AnalogLeverBlockEntity(event.block);
        // Using player.isSneaking handles shifting context natively
        be.onInteract(event.player, event.player.isSneaking);
    }
}
