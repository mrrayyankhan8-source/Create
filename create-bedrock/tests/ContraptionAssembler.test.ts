import { ContraptionAssembler } from "../scripts/create/contraptions/ContraptionAssembler.js";

class MockBlock {
    constructor(public typeId: string) {}
}

class MockDimension {
    public blocks: Map<string, MockBlock> = new Map();

    getBlock(pos: any) {
        return this.blocks.get(`${pos.x},${pos.y},${pos.z}`);
    }

    setBlock(pos: any, id: string) {
        this.blocks.set(`${pos.x},${pos.y},${pos.z}`, new MockBlock(id));
    }
}

describe("ContraptionAssembler", () => {
    it("should assemble contiguous Create blocks into a Contraption", () => {
        const dim = new MockDimension();

        // Setup a 3x1 contiguous line of create shafts
        dim.setBlock({x: 0, y: 0, z: 0}, "create:mechanical_bearing");
        dim.setBlock({x: 0, y: 1, z: 0}, "create:shaft");
        dim.setBlock({x: 0, y: 2, z: 0}, "create:shaft");
        dim.setBlock({x: 0, y: 3, z: 0}, "minecraft:air"); // Stops here

        const contraption = ContraptionAssembler.assemble(dim as any, {x:0, y:0, z:0});

        expect(contraption).not.toBeNull();
        expect(contraption!.blocks.size).toBe(3);

        // Verify local coordinates are correct
        expect(contraption!.blocks.has("0,0,0")).toBe(true);
        expect(contraption!.blocks.has("0,1,0")).toBe(true);
        expect(contraption!.blocks.has("0,2,0")).toBe(true);

        expect(contraption!.bounds.max.y).toBe(2);
    });

    it("should fail assembly if blocks exceed max limit", () => {
        const dim = new MockDimension();

        // Setup infinite loop mock theoretically, but we just manually set 5 blocks and limit to 2
        dim.setBlock({x: 0, y: 0, z: 0}, "create:shaft");
        dim.setBlock({x: 0, y: 1, z: 0}, "create:shaft");
        dim.setBlock({x: 0, y: 2, z: 0}, "create:shaft");
        dim.setBlock({x: 0, y: 3, z: 0}, "create:shaft");

        const contraption = ContraptionAssembler.assemble(dim as any, {x:0, y:0, z:0}, 2);

        expect(contraption).toBeNull();
    });
});
