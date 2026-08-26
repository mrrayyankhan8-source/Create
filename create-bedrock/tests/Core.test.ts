import { Vector3, Transform } from "../scripts/utilities/Math";
import { TickManager } from "../scripts/core/TickManager";

describe("Math Utilities", () => {
    test("Vector3 addition", () => {
        const v1 = new Vector3(1, 2, 3);
        const v2 = new Vector3(4, 5, 6);
        const v3 = v1.add(v2);
        expect(v3.x).toBe(5);
        expect(v3.y).toBe(7);
        expect(v3.z).toBe(9);
    });

    test("Vector3 normalization", () => {
        const v = new Vector3(3, 0, 4);
        const n = v.normalize();
        expect(n.x).toBe(0.6);
        expect(n.y).toBe(0);
        expect(n.z).toBe(0.8);
    });
});

describe("Tick Manager", () => {
    test("Frequencies trigger correctly", () => {
        const manager = new TickManager();
        let highCount = 0;
        let normalCount = 0;
        let lowCount = 0;

        manager.registerHighFrequency(() => highCount++);
        manager.registerNormalFrequency(() => normalCount++);
        manager.registerLowFrequency(() => lowCount++);

        for (let i = 0; i < 20; i++) {
            manager.onTick();
        }

        expect(highCount).toBe(20);
        expect(normalCount).toBe(10);
        expect(lowCount).toBe(1);
    });
});
