import { Block, Container } from "@minecraft/server";
import { KineticBlockEntity } from "./KineticBlockEntity.js";

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
            // Stubbed trigger for tests
            if (this.checkForBasinRecipe()) {
                this.startProcessingBasin();
            }
        }
    }

    private checkForBasinRecipe(): boolean {
        // Stub: Assumes basin always has a recipe for the sake of kinetic testing
        // Full impl would look at block.location.y - 1 and read its inventory
        return false;
    }

    public startProcessingBasin(): void {
        if (this.running && this.runningTicks <= 20) return;
        this.running = true;
        this.runningTicks = 0;
    }

    private applyBasinRecipe(): void {
        // Full impl would remove ingredients from basin below, add outputs
    }

    public override needsVisualEntity(): boolean {
        return true;
    }

    public override getVisualEntityId(): string | undefined {
        return "create:mechanical_mixer_visual";
    }
}
