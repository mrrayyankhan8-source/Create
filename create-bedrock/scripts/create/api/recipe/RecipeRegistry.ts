import { ItemStack } from "@minecraft/server";

export interface ProcessingRecipe {
    type: "milling" | "crushing" | "mixing";
    ingredients: string[]; // e.g. ["minecraft:wheat"]
    results: { typeId: string, amount: number, chance?: number }[];
    processingTime: number;
}

/**
 * Global registry mimicking Java's RecipeManager specifically for Create's processing machines.
 */
export class RecipeRegistry {
    public static recipes: ProcessingRecipe[] = [];

    public static register(recipe: ProcessingRecipe): void {
        this.recipes.push(recipe);
    }

    public static getRecipeFor(type: string, inputStack: ItemStack): ProcessingRecipe | null {
        for (const recipe of this.recipes) {
            if (recipe.type === type && recipe.ingredients.includes(inputStack.typeId)) {
                return recipe;
            }
        }
        return null;
    }
}
