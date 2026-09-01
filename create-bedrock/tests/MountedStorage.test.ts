import { MountedStorageManager } from "../scripts/create/contraptions/MountedStorageManager.js";
import { MountedFluidStorage } from "../scripts/create/contraptions/MountedFluidStorage.js";
import { ContraptionAssembler } from "../scripts/create/contraptions/ContraptionAssembler.js";
import { Contraption } from "../scripts/create/contraptions/Contraption.js";

jest.mock("@minecraft/server", () => ({
    ItemStack: class {
        constructor(public typeId: string, public amount: number) {}
    },
    BlockPermutation: {
        resolve: (typeId: string) => ({
            withState: () => ({})
        })
    }
}), { virtual: true });

class MockContainer {
    public slots: any[] = new Array(27).fill(undefined);
    public size: number = 27;

    getItem(slot: number) {
        return this.slots[slot];
    }

    setItem(slot: number, stack: any | undefined) {
        this.slots[slot] = stack;
    }

    clearAll() {
        this.slots = new Array(27).fill(undefined);
    }
}

class MockBlock {
    public typeId: string;
    public container: MockContainer | null;

    constructor(typeId: string, hasContainer: boolean = false) {
        this.typeId = typeId;
        this.container = hasContainer ? new MockContainer() : null;
    }

    getComponent(id: string) {
        if (id === "minecraft:inventory" && this.container) {
            return { container: this.container };
        }
        return undefined;
    }

    setPermutation(perm: any) {}

    get permutation() {
        return {
            getAllStates: () => ({})
        };
    }
}

describe("Mounted Storage", () => {
    it("should extract items from a block container into virtual storage when mounted", () => {
        const manager = new MountedStorageManager();
        const block = new MockBlock("minecraft:chest", true);

        block.container!.setItem(0, { typeId: "minecraft:apple", amount: 5 } as any);
        block.container!.setItem(15, { typeId: "minecraft:diamond", amount: 1 } as any);

        const pos = {x: 0, y: 1, z: 0};
        const success = manager.attachBlock(pos, block as any);

        expect(success).toBe(true);
        expect(block.container!.getItem(0)).toBeUndefined(); // Should be empty now

        const stored = manager.itemStorages.get("0,1,0");
        expect(stored).toBeDefined();
        expect(stored![0].typeId).toBe("minecraft:apple");
        expect(stored![15].typeId).toBe("minecraft:diamond");
    });

    it("should inject items back into a block container when unmounted", () => {
        const manager = new MountedStorageManager();
        manager.itemStorages.set("0,1,0", [{ typeId: "minecraft:stone", amount: 64 } as any]);

        const block = new MockBlock("minecraft:chest", true);
        manager.unmount({x: 0, y: 1, z: 0}, block as any);

        expect(block.container!.getItem(0)).toBeDefined();
        expect(block.container!.getItem(0)!.typeId).toBe("minecraft:stone");

        // Memory should be cleared
        expect(manager.itemStorages.size).toBe(0);
    });

    it("should assemble storage into a Contraption and disassemble it smoothly", () => {
        // Setup a mock dimension
        const grid = new Map<string, MockBlock>();

        // Mechanical Bearing (Anchor)
        grid.set("0,0,0", new MockBlock("create:mechanical_bearing"));
        // A Chest next to it
        const chest = new MockBlock("minecraft:chest", true);
        chest.container!.setItem(5, { typeId: "minecraft:iron_ingot", amount: 10 } as any);
        grid.set("0,1,0", chest);

        const mockDim = {
            getBlock: (pos: any) => grid.get(`${pos.x},${pos.y},${pos.z}`)
        };

        const contraption = ContraptionAssembler.assemble(mockDim as any, {x:0, y:0, z:0}, 100);

        expect(contraption).toBeDefined();
        expect(contraption!.blocks.size).toBe(2);

        // Original chest should be cleared upon assembly
        expect(chest.container!.getItem(5)).toBeUndefined();

        // Storage map should have it under relative coordinate "0,1,0"
        expect(contraption!.storage.itemStorages.size).toBe(1);
        expect(contraption!.storage.itemStorages.get("0,1,0")![5].typeId).toBe("minecraft:iron_ingot");

        // Disassemble it elsewhere
        const newAnchor = {x: 10, y: 10, z: 10};

        // Place new mock blocks for it to write to
        const newChest = new MockBlock("minecraft:chest", true);
        grid.set("10,11,10", newChest);

        contraption!.addBlocksToWorld(mockDim as any, newAnchor);

        // Items should be unmounted into newChest
        expect(newChest.container!.getItem(5)).toBeDefined();
        expect(newChest.container!.getItem(5)!.typeId).toBe("minecraft:iron_ingot");

        // Contraption internal storage should be empty
        expect(contraption!.storage.itemStorages.size).toBe(0);
    });
});
