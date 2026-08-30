import { world } from "@minecraft/server";
import { KineticBlockManager } from "../KineticBlockManager.js";
import { ShaftBlockEntity } from "../ShaftBlockEntity.js";
import { CogwheelBlockEntity } from "../CogwheelBlockEntity.js";
import { CreativeMotorBlockEntity } from "../CreativeMotorBlockEntity.js";

/**
 * Handles registering Bedrock blocks into the kinetic backend when placed/loaded.
 */
export function initializeKineticsEvents() {
    world.afterEvents.playerPlaceBlock.subscribe((event) => {
        const { block, dimension } = event;
        const typeId = block.typeId;

        if (typeId === "create:shaft") {
            const entity = new ShaftBlockEntity(block);
            KineticBlockManager.register(dimension, block.location, entity);
            entity.attachKinetics();
        } else if (typeId === "create:cogwheel") {
            const entity = new CogwheelBlockEntity(block, false);
            KineticBlockManager.register(dimension, block.location, entity);
            entity.attachKinetics();
        } else if (typeId === "create:large_cogwheel") {
            const entity = new CogwheelBlockEntity(block, true);
            KineticBlockManager.register(dimension, block.location, entity);
            entity.attachKinetics();
        } else if (typeId === "create:creative_motor") {
            const entity = new CreativeMotorBlockEntity(block);
            KineticBlockManager.register(dimension, block.location, entity);
            entity.attachKinetics();
        }
    });

    world.afterEvents.playerBreakBlock.subscribe((event) => {
        const { block, dimension, brokenBlockPermutation } = event;
        const typeId = brokenBlockPermutation.type.id;

        if (typeId.startsWith("create:")) {
            KineticBlockManager.remove(dimension, block.location);
        }
    });
}
