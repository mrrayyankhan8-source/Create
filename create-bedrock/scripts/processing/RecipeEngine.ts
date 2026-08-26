export interface Recipe {
    type: string;
    inputs: { itemTypeId: string; amount: number }[];
    outputs: { itemTypeId: string; amount: number }[];
    processingTime: number; // in ticks
}

export class RecipeEngine {
    private static recipes: Recipe[] = [];

    public static loadRecipes(json: string) {
        try {
            const parsed = JSON.parse(json);
            if (Array.isArray(parsed)) {
                this.recipes = parsed as Recipe[];
            }
        } catch (e) {
            console.error("Failed to parse recipes JSON");
        }
    }

    public static getRecipeFor(type: string, inputs: string[]): Recipe | undefined {
        return this.recipes.find(r =>
            r.type === type &&
            inputs.every(inputId => r.inputs.some(ri => ri.itemTypeId === inputId))
        );
    }
}
