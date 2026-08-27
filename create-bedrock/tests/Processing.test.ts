import { RecipeEngine, CreateRecipe } from "../scripts/processing/RecipeEngine";

describe("Recipe Engine", () => {
    beforeEach(() => {
        RecipeEngine.clear();
    });

    test("Successfully matches mixing recipes including heat", () => {
        const brassRecipe: CreateRecipe = {
            type: "create:mixing",
            heatRequirement: "heated",
            ingredients: [
                { item: "minecraft:copper_ingot", amount: 1 },
                { item: "create:zinc_ingot", amount: 1 }
            ],
            results: [
                { item: "create:brass_ingot", amount: 2 }
            ]
        };

        RecipeEngine.loadRecipes([brassRecipe]);

        const inputs = [
            { item: "minecraft:copper_ingot", amount: 1 },
            { item: "create:zinc_ingot", amount: 1 }
        ];

        // Fails if not heated
        expect(RecipeEngine.findMatch("create:mixing", inputs, "none")).toBeNull();

        // Succeeds if heated or superheated
        const match = RecipeEngine.findMatch("create:mixing", inputs, "heated");
        expect(match).not.toBeNull();
        expect(match?.results[0].item).toBe("create:brass_ingot");
    });
});
