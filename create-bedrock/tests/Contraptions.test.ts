import { Contraption } from "../scripts/create/contraptions/Contraption.js";
import { AbstractContraptionEntity } from "../scripts/create/contraptions/AbstractContraptionEntity.js";
import { ContraptionManager } from "../scripts/create/contraptions/ContraptionManager.js";

jest.mock("@minecraft/server", () => ({
    BlockPermutation: {
        resolve: jest.fn().mockReturnValue({
            withState: jest.fn().mockReturnThis()
        })
    }
}), { virtual: true });

class MockEntity {
    public isValidValue = true;
    public location = { x: 0, y: 0, z: 0 };
    public dimension = { getBlock: jest.fn() };

    isValid() { return this.isValidValue; }
    remove() { this.isValidValue = false; }
}

class TestContraptionEntity extends AbstractContraptionEntity {}

describe("Contraptions Foundation", () => {
    beforeEach(() => {
        ContraptionManager.contraptions.clear();
    });

    it("should assemble block maps and track bounds", () => {
        const contraption = new Contraption();

        contraption.addBlock({x: 0, y: 0, z: 0}, { pos: {x:0,y:0,z:0}, state: "minecraft:stone" });
        contraption.addBlock({x: 2, y: 1, z: -1}, { pos: {x:2,y:1,z:-1}, state: "minecraft:oak_log" });

        expect(contraption.blocks.size).toBe(2);
        expect(contraption.bounds.max.x).toBe(2);
        expect(contraption.bounds.min.z).toBe(-1);
    });

    it("should manage ticks and handle disassembly correctly", () => {
        const ent = new MockEntity();
        const ce = new TestContraptionEntity(ent as any);
        const contraption = new Contraption();

        ce.contraption = contraption;
        ContraptionManager.register("test_1", ce);

        expect(ce.initialized).toBe(false);
        ContraptionManager.tickAll();
        expect(ce.initialized).toBe(true);

        ce.disassemble();

        expect(ent.isValidValue).toBe(false);

        // Next tick should clear it from manager
        ContraptionManager.tickAll();
        expect(ContraptionManager.contraptions.has("test_1")).toBe(false);
    });
});
