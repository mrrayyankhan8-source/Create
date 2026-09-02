import { Block, Container, ItemStack } from "@minecraft/server";
import { KineticBlockEntity } from "./KineticBlockEntity.js";
import { RecipeRegistry, HeatCondition } from "../../api/recipe/RecipeRegistry.js";

/**
 * Port of com.simibubi.create.content.kinetics.mixer.MechanicalMixerBlockEntity
 */
export class MechanicalMixerBlockEntity extends KineticBlockEntity {
    public running: boolean = false;
    public runningTicks: number = 0;
    public processingTicks: number = -1;

    public override tick(): void {
        super.tick();

        const speed = Math.abs(this.getSpeed());

        if (this.runningTicks >= 40) {
            this.running = false;
            this.runningTicks = 0;
            // Schedule basin check in a full impl
            return;
        }

        if (this.running) {
            if (speed === 0) {
                if (this.runningTicks < 20) this.runningTicks = 40 - this.runningTicks;
                else if (this.runningTicks === 20) this.runningTicks++;
            }

            if (this.runningTicks === 20) {
                if (this.processingTicks < 0) {
                    // Start processing
                    let recipeSpeed = 1;
                    const safeSpeed = Math.max(speed, 1);
                    this.processingTicks = Math.max(Math.ceil(Math.log2(512 / safeSpeed) * Math.ceil(recipeSpeed * 15)) + 1, 1);
                } else {
                    this.processingTicks--;
                    if (this.processingTicks === 0) {
                        this.runningTicks++;
                        this.processingTicks = -1;
                        this.applyBasinRecipe();
                    }
                }
            }

            if (this.runningTicks !== 20) {
                this.runningTicks++;
            }
        } else if (speed > 0) {
            // Test if basin beneath us has a valid recipe
            if (this.checkForBasinRecipe()) {
                this.startProcessingBasin();
            }
        }
    }

    private checkForBasinRecipe(): boolean {
        // In full impl, this checks the block directly below
        const dim = this.block.dimension;
        const basinPos = { x: this.block.location.x, y: this.block.location.y - 1, z: this.block.location.z };
        try {
            const basinBlock = dim.getBlock(basinPos);
            if (!basinBlock || basinBlock.typeId !== "create:basin") return false;

            const inv = basinBlock.getComponent("minecraft:inventory") as any;
            if (!inv || !inv.container) return false;

            // In our simple prototype, we'll just query RecipeRegistry for a mixing recipe on the first item
            // Real create checks permutations of all ingredients
            const container = inv.container;
            for (let i = 0; i < container.size; i++) {
                const item = container.getItem(i);
                if (item) {
                    const inputs = [item];
                    const fluids: { fluid: string, amount: number }[] = []; // Not yet supported on standard basins without fluid API

                    const recipe = RecipeRegistry.getComplexRecipe("mixing", inputs, fluids, HeatCondition.NONE);
                    if (recipe) return true;
                }
            }
        } catch (e) {
            // Unloaded chunks or mocked dimensions
        }
        return false;
    }

    public startProcessingBasin(): void {
        if (this.running && this.runningTicks <= 20) return;
        this.running = true;
        this.runningTicks = 0;
    }

    private applyBasinRecipe(): void {
        const dim = this.block.dimension;
        const basinPos = { x: this.block.location.x, y: this.block.location.y - 1, z: this.block.location.z };
        try {
            const basinBlock = dim.getBlock(basinPos);
            if (!basinBlock || basinBlock.typeId !== "create:basin") return;

            const inv = basinBlock.getComponent("minecraft:inventory") as any;
            if (!inv || !inv.container) return;
            const container = inv.container;

            let matchedRecipe = null;
            let consumedSlot = -1;

            for (let i = 0; i < container.size; i++) {
                const item = container.getItem(i);
                if (item) {
                    matchedRecipe = RecipeRegistry.getComplexRecipe("mixing", [item], [], HeatCondition.NONE);
                    if (matchedRecipe) {
                        consumedSlot = i;
                        break;
                    }
                }
            }

            if (matchedRecipe && consumedSlot !== -1) {
                // Consume
                const item = container.getItem(consumedSlot);
                if (item.amount > 1) {
                    item.amount -= 1;
                    container.setItem(consumedSlot, item);
                } else {
                    container.setItem(consumedSlot, undefined);
                }

                // Add results
                for (const result of (matchedRecipe.results || [])) {
                    // Try to place in basin
                    for (let j = 0; j < container.size; j++) {
                        const outSlot = container.getItem(j);
                        if (!outSlot) {
                            try {
                                container.setItem(j, new ItemStack(result.typeId, result.amount));
                                break;
                            } catch (e) {}
                        } else if (outSlot.typeId === result.typeId && outSlot.amount + result.amount <= outSlot.maxAmount) {
                            outSlot.amount += result.amount;
                            container.setItem(j, outSlot);
                            break;
                        }
                    }
                }
            }
        } catch (e) {
        }
    }

    public override needsVisualEntity(): boolean {
        return true;
    }

    public override getVisualEntityId(): string | undefined {
        return "create:mechanical_mixer_visual";
    }
}
