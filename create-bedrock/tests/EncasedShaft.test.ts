import { KineticBlockManager } from "../scripts/create/kinetics/block/KineticBlockManager.js";
import { EncasedShaftBlockEntity } from "../scripts/create/kinetics/block/EncasedShaftBlockEntity.js";

class MockBlock {
    public dimension = { id: "overworld" };
    constructor(
        public location: any,
        public typeId: string
    ) {}

    get permutation() {
        return {
            getState: (name: string) => "x"
        };
    }
}

describe("EncasedShaftBlockEntity", () => {
    it("should request the correct visual entity", () => {
        const block = new MockBlock({x: 0, y: 0, z: 0}, "create:andesite_encased_shaft");
        const be = new EncasedShaftBlockEntity(block as any);

        expect(be.needsVisualEntity()).toBe(true);
        expect(be.getVisualEntityId()).toBe("create:shaft_visual");
    });
});
