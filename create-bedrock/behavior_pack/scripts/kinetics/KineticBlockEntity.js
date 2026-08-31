export class KineticBlockEntity {
    dimension;
    block;
    networkDirty = false;
    valid = true;
    source;
    speed = 0;
    constructor(block) {
        this.block = block;
        this.dimension = block.dimension;
    }
    isValid() {
        return this.valid;
    }
    setInvalid() {
        this.valid = false;
    }
    isSource() {
        return false;
    }
    getGeneratedSpeed() {
        return 0;
    }
    getTheoreticalSpeed() {
        return this.speed;
    }
    setSpeed(speed) {
        this.speed = speed;
    }
    hasSource() {
        return this.source !== undefined;
    }
    setSource(source) {
        this.source = source;
    }
    removeSource() {
        this.source = undefined;
    }
    calculateAddedStressCapacity() {
        return 0;
    }
    calculateStressApplied() {
        return 0;
    }
    updateFromNetwork(maxStress, currentStress, networkSize) {
        // Overridden by subclasses
    }
}
