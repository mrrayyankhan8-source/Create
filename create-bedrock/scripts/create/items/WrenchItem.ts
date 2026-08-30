import { ItemComponentUseOnEvent, Player, Block, system, world, Vector3, BlockPermutation, ItemStack } from "@minecraft/server";
import { KineticBlockManager } from "../kinetics/block/KineticBlockManager.js";

/**
 * Handles interactions for the Create Wrench
 */
export class WrenchItem {

    public static onUseOnBlock(event: ItemComponentUseOnEvent): void {
        const block = event.block;
        const player = event.source as Player;
        const face = event.blockFace;

        if (!block || !player) return;

        const isSneaking = player.isSneaking;

        if (isSneaking) {
            this.handleSneakWrench(block, player);
        } else {
            this.handleWrench(block, face, player);
        }
    }

    private static handleWrench(block: Block, face: string, player: Player): void {
        // Attempt to rotate block based on face
        try {
            const axisProp = block.permutation.getState("minecraft:block_face") || block.permutation.getState("minecraft:cardinal_direction");

            if (axisProp !== undefined) {
                // Simplified rotation logic (Cycle axis/direction)
                let newDir = axisProp;
                if (face === "Up" || face === "Down") {
                    if (axisProp === "east") newDir = "south";
                    else if (axisProp === "south") newDir = "west";
                    else if (axisProp === "west") newDir = "north";
                    else if (axisProp === "north") newDir = "east";
                } else if (face === "East" || face === "West") {
                     if (axisProp === "up") newDir = "north";
                     else if (axisProp === "north") newDir = "down";
                     else if (axisProp === "down") newDir = "south";
                     else if (axisProp === "south") newDir = "up";
                } else {
                     if (axisProp === "up") newDir = "east";
                     else if (axisProp === "east") newDir = "down";
                     else if (axisProp === "down") newDir = "west";
                     else if (axisProp === "west") newDir = "up";
                }

                if (newDir !== axisProp) {
                    const newPermutation = block.permutation.withState("minecraft:block_face", newDir);
                    // Re-evaluate kinetics for the block entity
                    const be = KineticBlockManager.get(block.dimension, block.location);
                    if (be) {
                        be.remove(); // Safely disconnect from old orientation
                    }

                    block.setPermutation(newPermutation);

                    // Re-add to network next tick after permutations settle
                    system.run(() => {
                        const newBe = KineticBlockManager.get(block.dimension, block.location);
                        if (newBe) {
                            newBe.updateSpeed();
                            KineticBlockManager.tickAll();
                        }
                    });

                    this.playRotateSound(block.dimension, block.location);
                }
            }
        } catch (e) {
            console.warn("Failed to rotate block:", e);
        }
    }

    private static handleSneakWrench(block: Block, player: Player): void {
        // Instantly break the block
        try {
            const typeId = block.typeId;
            const be = KineticBlockManager.get(block.dimension, block.location);
            if (be) {
                be.remove();
            }

            block.setPermutation(BlockPermutation.resolve("minecraft:air"));

            // Give item back to player (simplified drops)
            if (player.getGameMode() !== "creative") {
                 player.dimension.spawnItem(new ItemStack(typeId, 1), block.location);
            }

            this.playRemoveSound(block.dimension, block.location);
        } catch (e) {
             console.warn("Failed to dismantle block:", e);
        }
    }

    private static playRotateSound(dimension: any, pos: Vector3): void {
        // Java uses Create.RANDOM.nextFloat() + .5f -> pitch 0.5 to 1.5
        // We'll map it to a standard bedrock block interact sound
        try {
             dimension.playSound("random.click", pos, { pitch: 0.8 + Math.random() * 0.4, volume: 1.0 });
        } catch (e) {}
    }

    private static playRemoveSound(dimension: any, pos: Vector3): void {
        try {
             dimension.playSound("random.break", pos, { pitch: 0.5 + Math.random() * 0.5, volume: 1.0 });
        } catch (e) {}
    }
}
