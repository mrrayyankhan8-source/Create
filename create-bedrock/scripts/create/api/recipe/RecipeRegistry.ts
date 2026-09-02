import { ItemStack } from "@minecraft/server";

export enum HeatCondition {
    NONE = 0,
    HEATED = 1,
    SUPERHEATED = 2
}

export interface ItemIngredient {
    item?: string;
    tag?: string;
    amount?: number;
}

export interface FluidIngredient {
    fluid?: string;
    tag?: string;
    amount: number;
}

export interface ProcessingOutput {
    typeId: string; // mapping from Java's item string
    amount: number;
    chance?: number;
}

export interface FluidOutput {
    fluid: string;
    amount: number;
}

export interface ProcessingRecipe {
    type: "milling" | "crushing" | "mixing" | "pressing" | "compacting";
    ingredients?: ItemIngredient[];
    fluidIngredients?: FluidIngredient[];
    results?: ProcessingOutput[];
    fluidResults?: FluidOutput[];
    processingTime?: number;
    requiredHeat?: HeatCondition;
}

/**
 * Global registry mimicking Java's RecipeManager specifically for Create's processing machines.
 */
export class RecipeRegistry {
    public static recipes: ProcessingRecipe[] = [];

    public static register(recipe: ProcessingRecipe): void {
        this.recipes.push(recipe);
    }

    /**
     * Checks if a single input ItemStack matches an ItemIngredient
     */
    public static matchesItem(ingredient: ItemIngredient, inputStack: ItemStack): boolean {
        if (!inputStack) return false;

        // Match by exact item ID
        if (ingredient.item) {
            if (ingredient.item !== inputStack.typeId) {
                return false;
            }
        }

        // Match by tag
        if (ingredient.tag) {
            if (!inputStack.hasTag(ingredient.tag)) {
                return false;
            }
        }

        // Check amount if specified
        if (ingredient.amount && inputStack.amount < ingredient.amount) {
            return false;
        }

        return true;
    }

    public static getRecipeFor(type: string, inputStack: ItemStack): ProcessingRecipe | null {
        for (const recipe of this.recipes) {
            if (recipe.type !== type) continue;

            // For simple single-item recipes like milling/crushing
            if (recipe.ingredients && recipe.ingredients.length > 0) {
                if (this.matchesItem(recipe.ingredients[0], inputStack)) {
                    return recipe;
                }
            }
        }
        return null;
    }

    /**
     * For machines like the Mixer that take multiple inputs (items + fluids)
     */
    public static getComplexRecipe(
        type: string,
        inputItems: ItemStack[],
        inputFluids: { fluid: string, amount: number }[],
        currentHeat: HeatCondition
    ): ProcessingRecipe | null {
        for (const recipe of this.recipes) {
            if (recipe.type !== type) continue;

            // Heat condition check
            const reqHeat = recipe.requiredHeat || HeatCondition.NONE;
            if (currentHeat < reqHeat) continue;

            // Simplified matching logic for now: check if ALL recipe ingredients are met by inputs
            // A more rigorous graph-matching or permutation-matching is needed for exact matching,
            // but for typical Create recipes, greedily finding matches is usually sufficient.

            let itemsMatched = true;
            if (recipe.ingredients) {
                for (const ing of recipe.ingredients) {
                    const match = inputItems.find(item => this.matchesItem(ing, item));
                    if (!match) {
                        itemsMatched = false;
                        break;
                    }
                }
            }

            let fluidsMatched = true;
            if (recipe.fluidIngredients) {
                for (const fing of recipe.fluidIngredients) {
                    const match = inputFluids.find(f => f.fluid === fing.fluid && f.amount >= fing.amount);
                    if (!match) {
                        fluidsMatched = false;
                        break;
                    }
                }
            }

            if (itemsMatched && fluidsMatched) {
                return recipe;
            }
        }
        return null;
    }
}
