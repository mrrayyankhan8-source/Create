import { BlockCustomComponent, BlockComponentTickEvent, BlockComponentPlayerPlaceBeforeEvent, BlockComponentPlayerDestroyEvent, system } from "@minecraft/server";
import { KineticBlockManager } from "./KineticBlockManager.js";
import { CreativeMotorBlockEntity } from "./CreativeMotorBlockEntity.js";
import { ShaftBlockEntity } from "./ShaftBlockEntity.js";
import { CogwheelBlockEntity } from "./CogwheelBlockEntity.js";
import { GearboxBlockEntity } from "./GearboxBlockEntity.js";
import { GearshiftBlockEntity } from "./GearshiftBlockEntity.js";
import { ClutchBlockEntity } from "./ClutchBlockEntity.js";
import { EncasedShaftBlockEntity } from "./EncasedShaftBlockEntity.js";
import { BeltBlockEntity } from "../belt/BeltBlockEntity.js";

/**
 * Bedrock Custom Block Component attached to all Kinetic blocks to handle lifecycle events.
 */
export class KineticBlockComponent implements BlockCustomComponent {

    /**
     * Factory to instantiate the correct BE class based on the block type.
     */
    private createBE(block: any): any {
        const id = block.typeId;
        if (id.includes("creative_motor")) return new CreativeMotorBlockEntity(block);
        if (id.includes("cogwheel")) return new CogwheelBlockEntity(block, id.includes("large"));
        if (id.includes("encased_shaft")) return new EncasedShaftBlockEntity(block);
        if (id.includes("gearbox")) return new GearboxBlockEntity(block);
        if (id.includes("gearshift")) return new GearshiftBlockEntity(block);
        if (id.includes("clutch")) return new ClutchBlockEntity(block);
        if (id.includes("belt")) return new BeltBlockEntity(block);

        // Fallback default
        return new ShaftBlockEntity(block);
    }

    onPlayerPlace(event: BlockComponentPlayerPlaceBeforeEvent): void {
        const block = event.block;
        const be = this.createBE(block);
        KineticBlockManager.register(block.dimension, block.location, be);
        be.attachKinetics();
    }

    onPlayerDestroy(event: BlockComponentPlayerDestroyEvent): void {
        const block = event.block;
        KineticBlockManager.remove(block.dimension, block.location);
    }

    onTick(event: BlockComponentTickEvent): void {
        const block = event.block;

        // Re-hydration logic: if a block ticks but isn't in the manager, the world was reloaded
        // We use a tick event to ensure we reconstruct the graph when chunks load.
        let be = KineticBlockManager.get(block.dimension, block.location);
        if (!be) {
            be = this.createBE(block);
            KineticBlockManager.register(block.dimension, block.location, be!);
            be!.attachKinetics();
        }

        // Forward normal tick execution (which triggers things like belt item movement)
        be!.tick();
    }
}
