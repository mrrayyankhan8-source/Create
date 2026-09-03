import { RedstoneContactBlockEntity } from "../scripts/create/redstone/contact/RedstoneContactBlockEntity.js";
import { AnalogLeverBlockEntity } from "../scripts/create/redstone/analogLever/AnalogLeverBlockEntity.js";
import { Block, Player } from "@minecraft/server";

describe("Redstone Logic", () => {
    describe("Redstone Contact", () => {
        let mockPermutation: any;
        let mockBlock: any;

        beforeEach(() => {
            mockPermutation = {
                stateMap: { "create:powered": false },
                getState: jest.fn((key: string) => mockPermutation.stateMap[key]),
                withState: jest.fn((key: string, value: any) => {
                    const newPerm = { ...mockPermutation };
                    newPerm.stateMap = { ...mockPermutation.stateMap, [key]: value };
                    return newPerm;
                })
            };

            mockBlock = {
                permutation: mockPermutation,
                setPermutation: jest.fn((perm: any) => {
                    mockBlock.permutation = perm;
                })
            };
        });

        it("should turn on if opposite contact is active", () => {
            const be = new RedstoneContactBlockEntity(mockBlock);
            expect(be.hasContact).toBe(false);

            be.updateContactState(true);

            expect(be.hasContact).toBe(true);
            expect(mockBlock.setPermutation).toHaveBeenCalled();
            expect(mockBlock.permutation.getState("create:powered")).toBe(true);
        });
    });

    describe("Analog Lever", () => {
        let mockPermutation: any;
        let mockBlock: any;
        let mockPlayer: any;

        beforeEach(() => {
            mockPermutation = {
                stateMap: { "create:signal_strength": 0 },
                getState: jest.fn((key: string) => mockPermutation.stateMap[key]),
                withState: jest.fn((key: string, value: any) => {
                    const newPerm = { ...mockPermutation };
                    newPerm.stateMap = { ...mockPermutation.stateMap, [key]: value };
                    return newPerm;
                })
            };

            mockBlock = {
                permutation: mockPermutation,
                setPermutation: jest.fn((perm: any) => {
                    mockBlock.permutation = perm;
                })
            };

            mockPlayer = {
                isSneaking: false
            };
        });

        it("should increase signal strength when interacting normally", () => {
            const be = new AnalogLeverBlockEntity(mockBlock);
            be.onInteract(mockPlayer, false);

            expect(mockBlock.setPermutation).toHaveBeenCalled();
            expect(mockBlock.permutation.getState("create:signal_strength")).toBe(1);
        });

        it("should decrease signal strength when sneaking", () => {
            mockPermutation.stateMap["create:signal_strength"] = 5;

            const be = new AnalogLeverBlockEntity(mockBlock);
            be.onInteract(mockPlayer, true);

            expect(mockBlock.setPermutation).toHaveBeenCalled();
            expect(mockBlock.permutation.getState("create:signal_strength")).toBe(4);
        });

        it("should clamp signal strength to 0-15", () => {
            mockPermutation.stateMap["create:signal_strength"] = 0;
            const be = new AnalogLeverBlockEntity(mockBlock);
            be.onInteract(mockPlayer, true); // trying to decrease below 0
            expect(mockBlock.permutation.getState("create:signal_strength")).toBe(0);

            mockPermutation.stateMap["create:signal_strength"] = 15;
            be.onInteract(mockPlayer, false); // trying to increase above 15
            expect(mockBlock.permutation.getState("create:signal_strength")).toBe(15);
        });
    });
});
