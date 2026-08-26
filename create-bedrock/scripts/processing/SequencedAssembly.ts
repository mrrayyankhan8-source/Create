import { TransportedItem } from "../logistics/Belt";

export enum AssemblyStepType {
    DEPLOY,
    PRESS,
    SAW,
    SPOUT
}

export interface AssemblyStep {
    type: AssemblyStepType;
    requiredToolOrFluid?: string;
}

export interface SequencedRecipe {
    inputTypeId: string;
    outputTypeId: string;
    steps: AssemblyStep[];
    loops: number;
}

export class SequencedAssemblyManager {
    private activeRecipes: Map<string, SequencedRecipe> = new Map();

    public registerRecipe(id: string, recipe: SequencedRecipe) {
        this.activeRecipes.set(id, recipe);
    }

    /**
     * Called when an item on a belt passes under an active processing machine.
     */
    public processItem(item: TransportedItem, machineType: AssemblyStepType, machineTool?: string): boolean {
        // Logic to determine if this item can be processed by this step
        // In actual Create, items store NBT metadata detailing which step of which recipe they are on.
        // For Bedrock, we would append this tracking data to the item's lore or dynamic properties.
        return false;
    }
}
