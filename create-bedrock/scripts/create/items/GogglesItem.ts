import { Player, EntityComponentTypes, EntityEquippableComponent, EquipmentSlot } from "@minecraft/server";
import { KineticBlockManager } from "../kinetics/block/KineticBlockManager.js";

/**
 * Handles interactions and logic for the Engineer's Goggles
 */
export class GogglesItem {

    /**
     * Checks if the player currently has goggles equipped.
     * @param player The player to check
     * @returns True if goggles are equipped in the head slot
     */
    public static isEquipped(player: Player): boolean {
        try {
            const equippable = player.getComponent(EntityComponentTypes.Equippable) as EntityEquippableComponent;
            if (equippable) {
                const headItem = equippable.getEquipment(EquipmentSlot.Head);
                if (headItem && headItem.typeId === "create:goggles") {
                    return true;
                }
            }
        } catch (e) {
            // Ignore errors if component isn't available
        }
        return false;
    }

    /**
     * Ticks the goggles overlay logic for a player.
     * In Java, this renders a GUI overlay. In Bedrock, we use the player's actionbar (onScreenDisplay).
     * @param player The player being ticked
     */
    public static tickOverlay(player: Player): void {
        if (!this.isEquipped(player)) {
            return;
        }

        const blockResult = player.getBlockFromViewDirection({ maxDistance: 8 });

        if (blockResult && blockResult.block) {
            const be = KineticBlockManager.get(blockResult.block.dimension, blockResult.block.location);
            if (be) {
                // Formatting based on com.simibubi.create.content.equipment.goggles.IHaveGoggleInformation
                const speed = Math.abs(be.getSpeed());
                const capacity = be.calculateAddedStressCapacity();
                const impact = be.calculateStressApplied();

                let speedText = speed === 0 ? "§cStopped§r" : `§7Kinetic Speed:§r §a${speed.toFixed(1)} RPM§r`;
                let stressText = "";

                if (be.isSource()) {
                     stressText = `\n§7Capacity Provided:§r §b${capacity.toFixed(1)} su§r`;
                } else if (impact > 0) {
                     stressText = `\n§7Stress Impact:§r §c${impact.toFixed(1)} su§r`;
                }

                if (be.isOverStressed()) {
                     stressText += `\n§cOVERSTRESSED§r`;
                }

                player.onScreenDisplay.setActionBar(`${speedText}${stressText}`);
            }
        }
    }
}
