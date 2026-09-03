import { world, system } from "@minecraft/server";
import { KineticBlockComponent } from "../kinetics/block/KineticBlockComponent.js";
import { ItemUseRegistry } from "../events/ItemUseRegistry.js";
import { KineticBlockManager } from "../kinetics/block/KineticBlockManager.js";
import { initializeStressDefaults } from "../api/stress/BlockStressDefaults.js";
import { RedstoneRegistration } from "../redstone/registry/RedstoneRegistration.js";

export class CreateRegistry {
    public static initialize(): void {
        initializeStressDefaults();

        // Map the single custom component to our kinetics core.
        // In the actual behavior pack block JSONs, every Create kinetic block
        // should have "create:kinetic_block" under "minecraft:custom_components".
        world.beforeEvents.worldInitialize.subscribe((event) => {
            event.blockComponentRegistry.registerCustomComponent("create:kinetic_block", new KineticBlockComponent());
        });

        // Initialize user interaction logic (wrenches, goggles)
        ItemUseRegistry.initialize();

        // Main Kinetic Game Loop
        system.runInterval(() => {
            KineticBlockManager.tickAll();
        });
    }
}
