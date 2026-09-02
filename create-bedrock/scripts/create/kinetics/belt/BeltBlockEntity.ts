import { Block, Vector3, Dimension } from "@minecraft/server";
import { KineticBlockEntity } from "../block/KineticBlockEntity.js";
import { BeltInventory } from "./transport/BeltInventory.js";
import { KineticBlockManager } from "../block/KineticBlockManager.js";

/**
 * Port of com.simibubi.create.content.kinetics.belt.BeltBlockEntity
 */
export class BeltBlockEntity extends KineticBlockEntity {
    public controller: Vector3 | null = null;
    public beltLength: number = 0;
    public index: number = 0;
    public color: number = -1;

    private inventory: BeltInventory | null = null;

    public isController(): boolean {
        if (!this.controller) return false;
        return this.block.location.x === this.controller.x &&
               this.block.location.y === this.controller.y &&
               this.block.location.z === this.controller.z;
    }

    public getControllerBE(): BeltBlockEntity | null {
        if (!this.controller) return null;
        const be = KineticBlockManager.get(this.block.dimension, this.controller);
        if (be instanceof BeltBlockEntity) {
            return be;
        }
        return null;
    }

    public getBeltMovementSpeed(): number {
        return this.getSpeed() / 480.0;
    }

    public getDirectionAwareBeltMovementSpeed(): number {
        let offset = 1;
        const facing = this.getBeltFacing();

        // Match Java's math for axis directions
        if (facing === "south" || facing === "east") {
            offset = 1;
        } else if (facing === "north" || facing === "west") {
            offset = -1;
        }

        // Java: if (getBeltFacing().getAxis() == Axis.X) offset *= -1;
        if (facing === "east" || facing === "west") {
            offset *= -1;
        }

        return this.getBeltMovementSpeed() * offset;
    }

    public getBeltFacing(): string {
        const face = this.block.permutation.getState("minecraft:cardinal_direction");
        return face ? String(face) : "north";
    }

    public getInventory(): BeltInventory | null {
        if (!this.isController()) {
            const controllerBE = this.getControllerBE();
            if (controllerBE) return controllerBE.getInventory();
            return null;
        }
        if (!this.inventory) {
            this.inventory = new BeltInventory(this);
        }
        return this.inventory;
    }

    public override tick(): void {
        super.tick();

        // Only the controller ticks the inventory
        if (this.isController() && this.inventory) {
            this.inventory.tick();
        }
    }
}
