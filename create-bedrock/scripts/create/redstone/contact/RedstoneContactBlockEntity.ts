import { Block } from "@minecraft/server";

/**
 * Port of com.simibubi.create.content.redstone.contact.RedstoneContactBlockEntity
 */
export class RedstoneContactBlockEntity {
    public block: Block;
    public hasContact: boolean = false;

    constructor(block: Block) {
        this.block = block;
    }

    public updateContactState(contactState: boolean): void {
        this.hasContact = contactState;

        // Update block permutation to emit redstone signal in Bedrock
        // This assumes a custom block permutation "create:powered"
        const perm = this.block.permutation;
        if (perm.getState("create:powered") !== contactState) {
            this.block.setPermutation(perm.withState("create:powered", contactState));
        }
    }
}
