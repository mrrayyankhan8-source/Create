import { MillstoneBlockEntity } from "../scripts/create/kinetics/block/MillstoneBlockEntity.js";
import { KineticBlockManager } from "../scripts/create/kinetics/block/KineticBlockManager.js";
import { RecipeRegistry } from "../scripts/create/api/recipe/RecipeRegistry.js";

jest.mock("@minecraft/server", () => ({
    ItemStack: class {
        constructor(public typeId: string, public amount: number) {}
        maxAmount = 64;
    }
}), { virtual: true });

class MockContainer {
    public slots: (any | undefined)[] = new Array(10).fill(undefined);

    getItem(slot: number) {
        return this.slots[slot];
    }

    setItem(slot: number, stack: any | undefined) {
        this.slots[slot] = stack;
    }
}

class MockBlock {
    public dimension = { id: "overworld" };
    public typeId = "create:millstone";
    public container = new MockContainer();
    constructor(public location: any) {}

    getComponent(id: string) {
        if (id === "minecraft:inventory") return { container: this.container };
        return undefined;
    }

    get permutation() {
        return {
            getState: () => "up"
        };
    }
}

describe("Millstone Recipes", () => {
    beforeEach(() => {
        (KineticBlockManager as any).blockEntities.clear();
        RecipeRegistry.recipes = [];
    });

    it("should process items through the global RecipeRegistry successfully", () => {
        RecipeRegistry.register({
            type: "milling",
            ingredients: ["minecraft:wheat"],
            results: [{ typeId: "minecraft:wheat_seeds", amount: 2 }],
            processingTime: 50
        });

        const block = new MockBlock({x: 0, y: 0, z: 0});
        const millstone = new MillstoneBlockEntity(block as any);

        millstone.setSpeed(128); // Speed 128 -> ProcessingSpeed 8

        block.container.setItem(0, { typeId: "minecraft:wheat", amount: 1, maxAmount: 64 } as any);

        // Tick 1: detects recipe, sets timer to 50
        millstone.tick();
        expect(millstone.timer).toBe(50);

        // Complete processing (50 / 8 = roughly 7 ticks)
        for(let i=0; i<7; i++) {
            millstone.tick();
        }

        // Input should be consumed
        expect(block.container.getItem(0)).toBeUndefined();

        // Output should be populated dynamically based on registry data
        const output = block.container.getItem(1);
        expect(output).toBeDefined();
        expect(output!.typeId).toBe("minecraft:wheat_seeds");
        expect(output!.amount).toBe(2);
    });

    it("should reject inputs with no recipe", () => {
        const block = new MockBlock({x: 0, y: 0, z: 0});
        const millstone = new MillstoneBlockEntity(block as any);

        millstone.setSpeed(128);
        block.container.setItem(0, { typeId: "minecraft:dirt", amount: 1, maxAmount: 64 } as any); // No recipe for dirt

        millstone.tick();
        expect(millstone.timer).toBe(0);

        // Nothing happens
        for(let i=0; i<10; i++) {
            millstone.tick();
        }
        expect(block.container.getItem(0)).toBeDefined();
        expect(block.container.getItem(1)).toBeUndefined();
    });
});
