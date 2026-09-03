import { Block, Player, ItemStack } from "@minecraft/server";

/**
 * Port of com.simibubi.create.content.redstone.analogLever.AnalogLeverBlockEntity
 */
export class AnalogLeverBlockEntity {
    public block: Block;

    constructor(block: Block) {
        this.block = block;
    }

    public onInteract(player: Player, isSneaking: boolean): void {
        const perm = this.block.permutation;
        // In Bedrock, we use a block state 0-15 mapped as e.g. "create:signal_strength"
        let strength = perm.getState("create:signal_strength") as number || 0;

        if (isSneaking) {
            strength--;
        } else {
            strength++;
        }

        if (strength < 0) strength = 0;
        if (strength > 15) strength = 15;

        // Apply new permutation emitting the requested level
        if (perm.getState("create:signal_strength") !== strength) {
            this.block.setPermutation(perm.withState("create:signal_strength", strength));
        }
    }
}
