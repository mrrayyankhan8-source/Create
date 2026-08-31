import { SignalBlockEntity, SignalState } from "../scripts/create/trains/signal/SignalBlockEntity.js";
import { SignalEdgeGroup } from "../scripts/create/trains/signal/SignalEdgeGroup.js";
import { Train } from "../scripts/create/trains/entity/Train.js";

class MockBlock {
    constructor(public typeId: string) {}
    get permutation() {
        return {
            withState: () => this,
            getState: () => "invalid"
        };
    }
    setPermutation() {}
}

describe("Train Signals", () => {
    it("should turn red when edge group is occupied by a train", () => {
        const block = new MockBlock("create:track_signal");
        const signal = new SignalBlockEntity(block as any);

        const group = new SignalEdgeGroup("group_1");
        signal.edgeGroup = group;

        const train = new Train("train_1");

        // Initial state -> Empty track
        signal.tick();
        expect(signal.state).toBe(SignalState.GREEN);

        // Advance ticks to clear the 'switchToRedAfterTrainEntered' cooldown
        for (let i = 0; i < 20; i++) {
             signal.tick();
        }

        // Train enters block
        group.occupy(train);
        signal.tick();

        expect(signal.state).toBe(SignalState.RED);

        // Train leaves block
        group.vacate(train);
        signal.tick();
        expect(signal.state).toBe(SignalState.GREEN);
    });
});
