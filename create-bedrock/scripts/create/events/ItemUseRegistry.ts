import { world } from "@minecraft/server";
import { WrenchItem } from "../items/WrenchItem.js";
import { GogglesItem } from "../items/GogglesItem.js";

/**
 * Global entry point for registering and routing item use events
 */
export class ItemUseRegistry {

    public static initialize(): void {
        world.afterEvents.itemUseOn.subscribe((event) => {
            if (event.itemStack.typeId === "create:wrench") {
                WrenchItem.onUseOnBlock(event as any);
            }
        });

        // Tick loop for Goggles Overlay
        world.afterEvents.tick.subscribe(() => {
            const players = world.getAllPlayers();
            for (const player of players) {
                GogglesItem.tickOverlay(player);
            }
        });
    }
}
