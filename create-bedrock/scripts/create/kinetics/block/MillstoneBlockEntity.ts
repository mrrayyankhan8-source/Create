import { Block, ItemStack, Container } from "@minecraft/server";
import { KineticBlockEntity } from "./KineticBlockEntity.js";

/**
 * Port of com.simibubi.create.content.kinetics.millstone.MillstoneBlockEntity
 * Handles internal processing of items based on rotational speed.
 */
export class MillstoneBlockEntity extends KineticBlockEntity {
    public timer: number = 0;

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
        if (this.canProcess(inputStack)) {
            // Hardcoded duration for stub, usually pulled from recipe
            this.timer = 100;
        }
    }

    private getInventory(): Container | undefined {
        const invComp = this.block.getComponent("minecraft:inventory") as any;
        return invComp?.container;
    }

    private canProcess(stack: ItemStack): boolean {
        // Stubbed recipe validation: accept anything tagged 'forge:ores' or wheat for example
        // We will hardcode a basic rule for testing
        if (stack.typeId === "minecraft:wheat") return true;
        if (stack.typeId === "minecraft:cobblestone") return true;
        return false;
    }

    private process(inventory: Container, inputStack: ItemStack | undefined): void {
        if (!inputStack) return;

        // Try to place output
        let outputId = "minecraft:air";
        let outputAmount = 1;

        if (inputStack.typeId === "minecraft:wheat") {
            outputId = "minecraft:bread"; // Wheat flour placeholder
        } else if (inputStack.typeId === "minecraft:cobblestone") {
            outputId = "minecraft:gravel";
        }

        if (outputId !== "minecraft:air") {
            // Find empty output slot
            let placed = false;
            for (let i = 1; i <= 9; i++) {
                const outSlot = inventory.getItem(i);
                if (!outSlot) {
                    inventory.setItem(i, new ItemStack(outputId, outputAmount));
                    placed = true;
                    break;
                } else if (outSlot.typeId === outputId && outSlot.amount < outSlot.maxAmount) {
                    outSlot.amount += outputAmount;
                    inventory.setItem(i, outSlot);
                    placed = true;
                    break;
                }
            }

            if (placed) {
                if (inputStack.amount > 1) {
                    inputStack.amount -= 1;
                    inventory.setItem(0, inputStack);
                } else {
                    inventory.setItem(0, undefined);
                }
            }
        }
    }
}
