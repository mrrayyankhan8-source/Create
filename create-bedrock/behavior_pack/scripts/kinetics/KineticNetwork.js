// TorquePropagator placeholder - to be implemented
export class TorquePropagator {
    static networks = new Map();
}
export class KineticNetwork {
    id;
    initialized = false;
    sources;
    members;
    currentCapacity = 0;
    currentStress = 0;
    unloadedCapacity = 0;
    unloadedStress = 0;
    unloadedMembers = 0;
    constructor(id) {
        this.id = id;
        this.sources = new Map();
        this.members = new Map();
    }
    initFromTE(maxStress, currentStress, membersCount) {
        this.unloadedCapacity = maxStress;
        this.unloadedStress = currentStress;
        this.unloadedMembers = membersCount;
        this.initialized = true;
        this.updateStress();
        this.updateCapacity();
    }
    addSilently(be, lastCapacity, lastStress) {
        if (this.members.has(be))
            return;
        if (be.isSource()) {
            this.unloadedCapacity -= lastCapacity * KineticNetwork.getStressMultiplierForSpeed(be.getGeneratedSpeed());
            const addedStressCapacity = be.calculateAddedStressCapacity();
            this.sources.set(be, addedStressCapacity);
        }
        this.unloadedStress -= lastStress * KineticNetwork.getStressMultiplierForSpeed(be.getTheoreticalSpeed());
        const stressApplied = be.calculateStressApplied();
        this.members.set(be, stressApplied);
        this.unloadedMembers--;
        if (this.unloadedMembers < 0)
            this.unloadedMembers = 0;
        if (this.unloadedCapacity < 0)
            this.unloadedCapacity = 0;
        if (this.unloadedStress < 0)
            this.unloadedStress = 0;
    }
    add(be) {
        if (this.members.has(be))
            return;
        if (be.isSource()) {
            this.sources.set(be, be.calculateAddedStressCapacity());
        }
        this.members.set(be, be.calculateStressApplied());
        this.updateFromNetwork(be);
        be.networkDirty = true;
    }
    updateCapacityFor(be, capacity) {
        this.sources.set(be, capacity);
        this.updateCapacity();
    }
    updateStressFor(be, stress) {
        this.members.set(be, stress);
        this.updateStress();
    }
    remove(be) {
        if (!this.members.has(be))
            return;
        if (be.isSource()) {
            this.sources.delete(be);
        }
        this.members.delete(be);
        be.updateFromNetwork(0, 0, 0);
        if (this.members.size === 0) {
            const dimNetworks = TorquePropagator.networks.get(be.dimension.id);
            if (dimNetworks) {
                dimNetworks.delete(this.id);
            }
            return;
        }
        const firstMember = Array.from(this.members.keys())[0];
        if (firstMember) {
            firstMember.networkDirty = true;
        }
    }
    sync() {
        for (const be of this.members.keys()) {
            this.updateFromNetwork(be);
        }
    }
    updateFromNetwork(be) {
        be.updateFromNetwork(this.currentCapacity, this.currentStress, this.getSize());
    }
    updateCapacity() {
        const newMaxStress = this.calculateCapacity();
        if (this.currentCapacity !== newMaxStress) {
            this.currentCapacity = newMaxStress;
            this.sync();
        }
    }
    updateStress() {
        const newStress = this.calculateStress();
        if (this.currentStress !== newStress) {
            this.currentStress = newStress;
            this.sync();
        }
    }
    updateNetwork() {
        const newStress = this.calculateStress();
        const newMaxStress = this.calculateCapacity();
        if (this.currentStress !== newStress || this.currentCapacity !== newMaxStress) {
            this.currentStress = newStress;
            this.currentCapacity = newMaxStress;
            this.sync();
        }
    }
    calculateCapacity() {
        let presentCapacity = 0;
        for (const be of Array.from(this.sources.keys())) {
            if (!be.isValid()) {
                this.sources.delete(be);
                continue;
            }
            presentCapacity += this.getActualCapacityOf(be);
        }
        return presentCapacity + this.unloadedCapacity;
    }
    calculateStress() {
        let presentStress = 0;
        for (const be of Array.from(this.members.keys())) {
            if (!be.isValid()) {
                this.members.delete(be);
                continue;
            }
            presentStress += this.getActualStressOf(be);
        }
        return presentStress + this.unloadedStress;
    }
    getActualCapacityOf(be) {
        const sourceVal = this.sources.get(be) ?? 0;
        return sourceVal * KineticNetwork.getStressMultiplierForSpeed(be.getGeneratedSpeed());
    }
    getActualStressOf(be) {
        const memberVal = this.members.get(be) ?? 0;
        return memberVal * KineticNetwork.getStressMultiplierForSpeed(be.getTheoreticalSpeed());
    }
    static getStressMultiplierForSpeed(speed) {
        return Math.abs(speed);
    }
    getSize() {
        return this.unloadedMembers + this.members.size;
    }
}
