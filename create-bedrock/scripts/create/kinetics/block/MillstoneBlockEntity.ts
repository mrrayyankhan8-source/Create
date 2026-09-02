import { Block, ItemStack, Container } from "@minecraft/server";
import { KineticBlockEntity } from "./KineticBlockEntity.js";
import { RecipeRegistry, ProcessingRecipe } from "../../api/recipe/RecipeRegistry.js";

/**
 * Port of com.simibubi.create.content.kinetics.millstone.MillstoneBlockEntity
 * Handles internal processing of items based on rotational speed.
 */
export class MillstoneBlockEntity extends KineticBlockEntity {
    public timer: number = 0;
    private currentRecipe: ProcessingRecipe | null = null;

    // In Bedrock, we will interface with the actual block container component for ease of use
    // Input slot: 0
    // Output slots: 1-9

    public getProcessingSpeed(): number {
        const speed = Math.abs(this.getSpeed());
        const processingSpeed = Math.floor(speed / 16.0);
        return Math.max(1, Math.min(processingSpeed, 512));
    }

    public override tick(): void {
        super.tick();

        const speed = this.getSpeed();
        if (speed === 0) return;

        const inventory = this.getInventory();
        if (!inventory) return;

        const inputStack = inventory.getItem(0);

        // Timer ticking logic
        if (this.timer > 0) {
            this.timer -= this.getProcessingSpeed();

            // Spawn particles logic would go here if client side (using event/effect bridge)

            if (this.timer <= 0) {
                this.process(inventory, inputStack);
            }
            return;
        }

        if (!inputStack) return;

        // If we have an input but no timer, we check for a valid recipe
        const recipe = RecipeRegistry.getRecipeFor("milling", inputStack);
        if (recipe) {
            this.currentRecipe = recipe;
            this.timer = recipe.processingTime ?? 100;
        }
    }

    private getInventory(): Container | undefined {
        const invComp = this.block.getComponent("minecraft:inventory") as any;
        return invComp?.container;
    }

    private process(inventory: Container, inputStack: ItemStack | undefined): void {
        if (!inputStack || !this.currentRecipe) return;

        let allPlaced = true;

        const results = this.currentRecipe.results || [];
        for (const result of results) {
            // In full impl, this processes % chance drops (e.g. wheat seeds with 25% chance).
            // For now, always grant items for stability.
            const outputId = result.typeId;
            const outputAmount = result.amount;

            // Find empty or stackable output slot
            let placed = false;
            for (let i = 1; i <= 9; i++) {
                const outSlot = inventory.getItem(i);
                if (!outSlot) {
                    try {
                        inventory.setItem(i, new ItemStack(outputId, outputAmount));
                        placed = true;
                        break;
                    } catch (e) {
                        // Usually implies missing item from mock environment, skip gracefully
                    }
                } else if (outSlot.typeId === outputId && outSlot.amount + outputAmount <= outSlot.maxAmount) {
                    outSlot.amount += outputAmount;
                    inventory.setItem(i, outSlot);
                    placed = true;
                    break;
                }
            }
            if (!placed) {
                allPlaced = false;
            }
        }

        if (allPlaced) {
            if (inputStack.amount > 1) {
                inputStack.amount -= 1;
                inventory.setItem(0, inputStack);
            } else {
                inventory.setItem(0, undefined);
            }
            this.currentRecipe = null;
        }
    }
}
