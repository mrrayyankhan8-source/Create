import { BlockCustomComponent, BlockComponentTickEvent, BlockComponentPlayerInteractEvent } from "@minecraft/server";

export class EncasedKineticBlockComponent implements BlockCustomComponent {

    // Encased blocks handle wrenched interactions via "create:on_interact" event triggering a set_block,
    // so the logic here is mainly to handle any runtime kinetic logic if necessary.
    onTick(e: BlockComponentTickEvent) {
        // Handled by KineticBlockEntity mapping
    }

}
