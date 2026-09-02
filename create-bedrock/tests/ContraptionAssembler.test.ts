import { ContraptionAssembler } from "../scripts/create/contraptions/ContraptionAssembler.js";

class MockBlock {
    public typeId: string;
    constructor(typeId: string) {
        this.typeId = typeId;
    }

    getComponent(id: string) { return undefined; }
}

describe("Contraption Assembler", () => {
    it("should assemble a group of blocks using BFS", () => {
        const mockDimension = {
            getBlock: (pos: {x: number, y: number, z: number}) => {
                if (pos.x >= 0 && pos.x <= 2 && pos.y === 0 && pos.z === 0) {
                    return new MockBlock("create:linear_chassis");
                }
                return undefined;
            }
        };

        const contraption = ContraptionAssembler.assemble(mockDimension as any, {x: 0, y: 0, z: 0}, 100);

        expect(contraption).toBeDefined();
        expect(contraption!.blocks.size).toBe(3);
    });
});
