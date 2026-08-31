import { TrainStationBlockEntity } from "../scripts/create/trains/station/TrainStationBlockEntity.js";

class MockBlock {
    constructor(public typeId: string) {}
    get permutation() {
        return {
            getState: () => true
        };
    }
}

describe("Train Stations", () => {
    it("should assemble and disassemble trains from a valid track node", () => {
        const block = new MockBlock("create:track_station");
        const station = new TrainStationBlockEntity(block as any);

        // Cannot assemble if no track node is bound
        expect(station.assembleTrain("train_1")).toBeNull();

        station.trackNodeId = "node_1";

        // Assemble train
        const train = station.assembleTrain("train_1");
        expect(train).not.toBeNull();
        expect(station.boundTrain).toBe(train);

        // Disassemble
        station.disassembleTrain();
        expect(station.boundTrain).toBeNull();
    });
});
