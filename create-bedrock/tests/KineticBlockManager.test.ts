import { KineticBlockManager } from '../src/kinetics/KineticBlockManager';
import { IKineticBlockEntity } from '../src/kinetics/types';

class MockKineticBlock implements IKineticBlockEntity {
    pos = { x: 0, y: 0, z: 0 };
    networkDirty = false;
    _isSource = false;
    _capacity = 0;
    _stress = 0;
    _speed = 0;

    lastReceivedCapacity = 0;
    lastReceivedStress = 0;

    constructor(isSource: boolean, capacity: number, stress: number, speed: number) {
        this._isSource = isSource;
        this._capacity = capacity;
        this._stress = stress;
        this._speed = speed;
    }

    isSource = () => this._isSource;
    getGeneratedSpeed = () => this._speed;
    calculateAddedStressCapacity = () => this._capacity;
    getTheoreticalSpeed = () => this._speed;
    calculateStressApplied = () => this._stress;

    updateFromNetwork(maxStress: number, currentStress: number, networkSize: number) {
        this.lastReceivedCapacity = maxStress;
        this.lastReceivedStress = currentStress;
    }
}

test('initializes without error', () => {
    expect(() => KineticBlockManager.init()).not.toThrow();
});

test('KineticNetwork correctly calculates capacity and stress', () => {
    const manager = KineticBlockManager.getInstance();

    const generator = new MockKineticBlock(true, 256, 0, 16);
    generator.pos = { x: 1, y: 1, z: 1 };

    const consumer = new MockKineticBlock(false, 0, 32, 16);
    consumer.pos = { x: 2, y: 1, z: 1 };

    manager.registerBlockEntity(generator);
    manager.registerBlockEntity(consumer);

    const network = manager.getOrCreateNetworkFor(generator);
    network.add(consumer); // Usually happens during block neighbor discovery

    manager.tick();

    // capacity: 256
    // stress: 32
    expect(generator.lastReceivedCapacity).toBe(256);
    expect(consumer.lastReceivedCapacity).toBe(256);
    expect(generator.lastReceivedStress).toBe(32);
    expect(consumer.lastReceivedStress).toBe(32);
});
