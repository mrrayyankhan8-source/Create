import { BeltBlockEntity } from "../scripts/create/kinetics/belt/BeltBlockEntity.js";
import { TransportedItemStack } from "../scripts/create/kinetics/belt/transport/TransportedItemStack.js";
import { ItemStack } from "@minecraft/server";
import { KineticBlockManager } from "../scripts/create/kinetics/block/KineticBlockManager.js";

class MockBlock {
    public dimension = { id: "overworld", spawnItem: jest.fn() };
    constructor(public location: any) {}
    get permutation() {
        return {
            getState: () => "south" // Use south to easily evaluate positive offset tests
        };
    }
}

class MockItemStack {
    constructor(public typeId: string, public amount: number) {}
    clone() { return new MockItemStack(this.typeId, this.amount); }
}

describe("BeltInventory", () => {
    beforeEach(() => {
        (KineticBlockManager as any).blockEntities.clear();
    });

    it("should move items along the belt according to speed", () => {
        const block = new MockBlock({ x: 0, y: 0, z: 0 });
        const belt = new BeltBlockEntity(block as any);
        belt.beltLength = 5;
        belt.controller = { x: 0, y: 0, z: 0 }; // self
        belt.setSpeed(16); // 16 RPM -> roughly 0.033 blocks per tick

        KineticBlockManager.register(block.dimension as any, block.location, belt);

        const inventory = belt.getInventory()!;

        const transported = new TransportedItemStack(new MockItemStack("minecraft:apple", 1) as any);
        transported.beltPosition = 0;

        inventory.addItem(transported);

        // Initial tick inserts it
        inventory.tick();

        expect(inventory.items.length).toBe(1);
        const itemOnBelt = inventory.items[0];

        const initialPos = itemOnBelt.beltPosition;

        inventory.tick(); // Apply movement

        expect(itemOnBelt.beltPosition).toBeGreaterThan(initialPos);
    });

    it("should eject item when it reaches end of belt", () => {
        const block = new MockBlock({ x: 0, y: 0, z: 0 });
        const belt = new BeltBlockEntity(block as any);
        belt.beltLength = 2;
        belt.controller = { x: 0, y: 0, z: 0 };
        belt.setSpeed(480); // Speed 480 -> 1 block per tick

        KineticBlockManager.register(block.dimension as any, block.location, belt);

        const inventory = belt.getInventory()!;
        const transported = new TransportedItemStack(new MockItemStack("minecraft:apple", 1) as any);
        transported.beltPosition = 1.5; // Starts near the end

        inventory.addItem(transported);

        inventory.tick(); // insert
        inventory.tick(); // move (1.5 + 1.0 = 2.5 > beltLength(2) -> eject)

        // Should be queued for removal
        inventory.tick(); // next tick flushes toRemove

        expect(inventory.items.length).toBe(0);
        expect(block.dimension.spawnItem).toHaveBeenCalled();
    });
});
