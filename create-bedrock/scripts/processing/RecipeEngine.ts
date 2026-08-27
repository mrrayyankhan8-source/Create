// Recipe Engine to process standard Create JSON recipes in Bedrock

export interface RecipeIngredient {
    item?: string;
    fluid?: string;
    amount?: number;
    tag?: string;
}

export interface RecipeResult {
    item?: string;
    fluid?: string;
    amount?: number;
    chance?: number;
}

export interface CreateRecipe {
    type: string; // e.g. 'create:mixing', 'create:pressing', 'create:crushing'
    ingredients: RecipeIngredient[];
    results: RecipeResult[];
    processingTime?: number;
    heatRequirement?: 'none' | 'heated' | 'superheated';
}

export class RecipeEngine {
    private static recipes: CreateRecipe[] = [];

    public static loadRecipes(recipePayloads: CreateRecipe[]) {
        this.recipes = this.recipes.concat(recipePayloads);
    }

    public static findMatch(type: string, inputs: RecipeIngredient[], currentHeat: 'none' | 'heated' | 'superheated' = 'none'): CreateRecipe | null {
        // Find a matching recipe
        for (const recipe of this.recipes) {
            if (recipe.type !== type) continue;

            // Check heat requirement
            if (recipe.heatRequirement) {
                if (recipe.heatRequirement === 'superheated' && currentHeat !== 'superheated') continue;
                if (recipe.heatRequirement === 'heated' && currentHeat === 'none') continue;
            }

            // Check ingredients (simplified matching for virtual backend)
            let matchesAll = true;
            for (const required of recipe.ingredients) {
                const found = inputs.find(input =>
                    (required.item && input.item === required.item) ||
                    (required.fluid && input.fluid === required.fluid)
                );

                if (!found) {
                    matchesAll = false;
                    break;
                }

                // If amount is required, check if input has enough
                if (required.amount && found.amount && found.amount < required.amount) {
                    matchesAll = false;
                    break;
                }
            }

            if (matchesAll) return recipe;
        }
        return null;
    }

    public static clear() {
        this.recipes = [];
    }
}
