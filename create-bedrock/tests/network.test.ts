import { KineticNetwork } from "../scripts/create/kinetics/network/KineticNetwork.js";

class MockBlockEntity {
    public _isSource = false;
    public _generatedSpeed = 0;
    public _theoreticalSpeed = 0;
    public _capacity = 0;
    public _stress = 0;
    public overStressed = false;

    public isSource(): boolean { return this._isSource; }
    public getGeneratedSpeed(): number { return this._generatedSpeed; }
    public getTheoreticalSpeed(): number { return this._theoreticalSpeed; }

    public calculateAddedStressCapacity(): number { return this._capacity; }
    public calculateStressApplied(): number { return this._stress; }

    public updateOverStressed(overStressed: boolean): boolean {
        const changed = this.overStressed !== overStressed;
        this.overStressed = overStressed;
        return changed;
    }

    public updateSpeed(): void {}
    public updateFromNetwork(): void {}
}

describe("KineticNetwork", () => {
    let network: KineticNetwork;

    beforeEach(() => {
        network = new KineticNetwork(1, "overworld");
        network.initialized = true;
    });

    it("should correctly update capacity from a source", () => {
        const source = new MockBlockEntity();
        source._isSource = true;
        source._capacity = 1000;
        source._generatedSpeed = 32;

        network.add(source as any);

        expect((network as any).currentCapacity).toBe(32000);
    });

    it("should correctly update stress from a member", () => {
        const member = new MockBlockEntity();
        member._isSource = false;
        member._stress = 500;
        member._theoreticalSpeed = 32;

        network.add(member as any);
        expect((network as any).currentStress).toBe(16000);
    });

    it("should identify overstressed networks", () => {
        const source = new MockBlockEntity();
        source._isSource = true;
        source._capacity = 100;
        source._generatedSpeed = 10;
        network.add(source as any);

        const member = new MockBlockEntity();
        member._isSource = false;
        member._stress = 200;
        member._theoreticalSpeed = 10;
        network.add(member as any);

        expect(member.overStressed).toBe(true);
        expect(source.overStressed).toBe(true);
    });
});
