import { BlockStressValues } from "../scripts/create/api/stress/BlockStressValues.js";
import { initializeStressDefaults } from "../scripts/create/api/stress/BlockStressDefaults.js";

describe("BlockStressValues", () => {
    beforeAll(() => {
        initializeStressDefaults();
    });

    it("should return correct capacity for creative motor", () => {
        expect(BlockStressValues.getCapacity("create:creative_motor")).toBe(16384);
    });

    it("should return correct capacity for water wheel", () => {
        expect(BlockStressValues.getCapacity("create:water_wheel")).toBe(16);
    });

    it("should return 0 capacity for shafts", () => {
        expect(BlockStressValues.getCapacity("create:shaft")).toBe(0);
    });

    it("should return correct impact for mechanical press", () => {
        expect(BlockStressValues.getImpact("create:mechanical_press")).toBe(8);
    });

    it("should return 0 impact for components with no impact like cogwheels", () => {
        expect(BlockStressValues.getImpact("create:cogwheel")).toBe(0);
    });

    it("should return 0 for unregistered blocks", () => {
        expect(BlockStressValues.getImpact("minecraft:stone")).toBe(0);
        expect(BlockStressValues.getCapacity("minecraft:stone")).toBe(0);
    });
});
